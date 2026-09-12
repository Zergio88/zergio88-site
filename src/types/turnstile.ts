export {};

type TurnstileParams = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  theme?: 'light' | 'dark';
};

interface Turnstile {
  render: (container: HTMLElement, params: TurnstileParams) => string;
  reset: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
    onTurnstileLoad?: () => void;
  }
}