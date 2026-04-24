import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => '/',
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  redirect: jest.fn(),
  getPathname: jest.fn(),
}));

import NavBar from './NavBar';

// Mock de next-intl y traducciones
jest.mock('next-intl', () => ({
  useLocale: () => 'es',
  useTranslations: () => (key: string) => {
    if (key === 'projects') return 'Proyectos';
    if (key === 'contact') return 'Contacto';
    if (key === 'about') return 'Sobre mí';
    if (key === 'themeToggle') return 'Cambiar tema';
    if (key === 'themeDark') return 'Oscuro';
    if (key === 'themeLight') return 'Claro';
    return key;
  }
}));

test('muestra el texto de proyectos', () => {
  render(<NavBar />);
  expect(screen.getByText(/proyectos/i)).toBeInTheDocument();
});

test('alterna tema y guarda preferencia', () => {
  document.documentElement.dataset.theme = 'dark';
  window.localStorage.clear();

  render(<NavBar />);

  const themeButtons = screen.getAllByRole('button', { name: /cambiar tema/i });
  fireEvent.click(themeButtons[0]);

  expect(document.documentElement.dataset.theme).toBe('light');
  expect(window.localStorage.getItem('theme')).toBe('light');
});