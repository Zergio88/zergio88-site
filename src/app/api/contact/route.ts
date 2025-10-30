import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "redis";

// Monthly counter persisted in Vercel KV when available, with an in-memory fallback.

function getMonthKey(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // e.g., 2025-10
}

const DEFAULT_MONTHLY_LIMIT = parseInt(process.env.RESEND_MONTHLY_LIMIT || "3000", 10);
const MAX_BODY_BYTES = parseInt(process.env.CONTACT_MAX_BODY_BYTES || "51200", 10); // 50KB default
const MAX_FIELD = {
  name: 80,
  email: 254,
  subject: 120,
  message: 4000,
};

// In-memory fallback state
const fallbackCounter: { month: string; count: number; limit: number } = {
  month: getMonthKey(),
  count: 0,
  limit: DEFAULT_MONTHLY_LIMIT,
};

const resend = new Resend(process.env.RESEND_API_KEY);

function isRedisConfigured() {
  return Boolean(process.env.REDIS_URL);
}

let redisClient: any | null = null;
async function getRedisClient(): Promise<any> {
  if (!redisClient) {
    const client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis Client Error", err));
    await client.connect();
    redisClient = client;
  }
  return redisClient;
}

function resetFallbackIfNewMonth() {
  const nowKey = getMonthKey();
  if (fallbackCounter.month !== nowKey) {
    fallbackCounter.month = nowKey;
    fallbackCounter.count = 0;
    fallbackCounter.limit = parseInt(
      process.env.RESEND_MONTHLY_LIMIT || String(DEFAULT_MONTHLY_LIMIT),
      10
    );
  }
}

async function getMonthlyCount(monthKey: string): Promise<number> {
  if (isRedisConfigured()) {
    const key = `contact:count:${monthKey}`;
    const client = await getRedisClient();
    const val = await client.get(key);
    const num = val ? parseInt(val, 10) : 0;
    return Number.isFinite(num) ? num : 0;
  }
  resetFallbackIfNewMonth();
  return fallbackCounter.count;
}

async function incrementMonthlyCount(monthKey: string): Promise<number> {
  if (isRedisConfigured()) {
    const key = `contact:count:${monthKey}`;
    const client = await getRedisClient();
    const newVal = await client.incr(key);
    return newVal;
  }
  resetFallbackIfNewMonth();
  fallbackCounter.count += 1;
  return fallbackCounter.count;
}

function validate(body: any) {
  const errors: Record<string, string> = {};
  if (!body?.name || typeof body.name !== "string" || !body.name.trim()) errors.name = "name_required";
  if (body?.name && String(body.name).length > MAX_FIELD.name) errors.name = "name_too_long";
  if (
    !body?.email ||
    typeof body.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  )
    errors.email = "email_invalid";
  if (body?.email && String(body.email).length > MAX_FIELD.email) errors.email = "email_too_long";
  if (!body?.message || typeof body.message !== "string" || !body.message.trim()) errors.message = "message_required";
  if (body?.subject && String(body.subject).length > MAX_FIELD.subject) errors.subject = "subject_too_long";
  if (body?.message && String(body.message).length > MAX_FIELD.message) errors.message = "message_too_long";
  return errors;
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  // Ensure env is configured
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { ok: false, error: "misconfigured" },
      { status: 500 }
    );
  }
  if (!recaptchaSecret) {
    return NextResponse.json(
      { ok: false, error: "captcha_misconfigured" },
      { status: 500 }
    );
  }

  // Guard against overly large payloads before parsing JSON
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  const monthKey = getMonthKey();
  const limit = parseInt(process.env.RESEND_MONTHLY_LIMIT || String(DEFAULT_MONTHLY_LIMIT), 10);
  const current = await getMonthlyCount(monthKey);
  if (current >= limit) {
    return NextResponse.json(
      { ok: false, reason: "limit", month: monthKey, limit },
      { status: 429 }
    );
  }

  try {
    const data = await req.json();

    // Verify reCAPTCHA token before proceeding
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || undefined;
    const captchaToken: string | undefined = data?.captchaToken;
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5");
    if (!captchaToken) {
      return NextResponse.json({ ok: false, reason: "captcha" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("secret", recaptchaSecret);
    params.append("response", captchaToken);
    if (ip) params.append("remoteip", ip);

    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const verifyJson: any = await verifyRes.json().catch(() => ({}));
    const ok = verifyJson?.success === true && (verifyJson?.score ?? 1) >= minScore;
    if (!ok) {
      return NextResponse.json({ ok: false, reason: "captcha" }, { status: 400 });
    }

    const errors = validate(data);
    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const subject = data.subject?.trim()
      ? `[Contacto] ${data.subject.trim()}`
      : `[Contacto] Nuevo mensaje de ${data.name}`;

    const html = `
      <div>
        <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Asunto:</strong> ${escapeHtml(data.subject || "(sin asunto)")}</p>
        <p><strong>Mensaje:</strong></p>
        <pre style="white-space:pre-wrap;font-family:system-ui;">${escapeHtml(data.message)}</pre>
      </div>
    `;

    const res = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: data.email,
    } as any);

    if ((res as any)?.error) {
      return NextResponse.json({ ok: false, error: (res as any).error }, { status: 502 });
    }

  // Count only successful sends
  const newCount = await incrementMonthlyCount(monthKey);

  return NextResponse.json({ ok: true, month: monthKey, count: newCount, limit });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
