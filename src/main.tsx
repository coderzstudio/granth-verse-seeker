import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker if in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      },
      error => {
        console.error('Service Worker registration failed:', error);
      }
    );
  });
}

// For push notifications: 
// This client-side code is a placeholder. 
// You'd need to configure VAPID keys and a backend push service for production.
window.enablePushNotifications = async () => {
  if (!('serviceWorker' in navigator)) return alert('Service Workers not supported');
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY_HERE>"
    });
    alert('Push subscribed! Send this subscription to your backend.');
    // Ideally, POST 'sub' to your server here
  } else {
    alert('Already subscribed for push notifications!');
  }
};
