export {};

type GrecaptchaParams = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
};

interface Grecaptcha {
  render: (container: HTMLElement, params: GrecaptchaParams) => number;
  reset: (id?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    onRecaptchaLoad?: () => void;
  }
}
