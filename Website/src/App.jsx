import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Explorer from '@/pages/Explorer';
import Ranking from '@/pages/Ranking';
import Challenge from '@/pages/Challenge';

const AuthenticatedApp = () => {
  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Explorer />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <AuthenticatedApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App