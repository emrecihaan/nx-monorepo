import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './app/app';

let root: Root | null = null;

export const mount = (element: HTMLElement) => {
  root = createRoot(element);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

export const unmount = () => {
  if (root) {
    root.unmount();
    root = null;
  }
};

// Proje sadece React tarafında lokal olarak (npx nx serve shift-app) ayağa kaldırıldığında çalışması için:
if (process.env.NODE_ENV === 'development' && !document.querySelector('app-react-wrapper')) {
  const devElement = document.getElementById('root');
  if (devElement) {
    mount(devElement);
  }
}
