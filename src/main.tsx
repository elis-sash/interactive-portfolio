import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { LocaleProvider } from './app/i18n/LocaleProvider';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <LocaleProvider>
    <App />
  </LocaleProvider>,
);
