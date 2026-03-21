import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyTheme } from './utils/theme'
import { storage } from './utils/storage'
import App from './App.tsx'

// Apply saved theme before first render to avoid flash
const savedSettings = storage.getSettings();
applyTheme(savedSettings.theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
