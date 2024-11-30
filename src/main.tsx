import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/theme-provider.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import { Toaster as Sonner } from '@components/ui/sonner'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
		<Sonner
        richColors
        theme="light"
        toastOptions={{}}
        closeButton
        visibleToasts={4}
      />
  </StrictMode>,
)
