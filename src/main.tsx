import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { registerSW } from 'virtual:pwa-register';

// Register service worker immediately for offline capability and PWA installability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('CrisisGrid updated in background.');
  },
  onOfflineReady() {
    console.log('CrisisGrid is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
