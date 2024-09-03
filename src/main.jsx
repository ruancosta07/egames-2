import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClientProvider, QueryClient } from 'react-query'
const client = new QueryClient({defaultOptions: {queries: {refetchOnWindowFocus: false},}},)
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
)
