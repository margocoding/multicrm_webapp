import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Sites } from './pages/Sites';
import { Products } from './pages/Products';
import { Imports } from './pages/Imports';
import { Articles } from './pages/Articles';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0B1120] bg-grid-pattern">
        {/* Background gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#0B1120] via-[#0B1120]/95 to-[#111827] pointer-events-none"></div>
        
        {/* Main content wrapper */}
        <div className="relative z-10">
          <Sidebar />
          <div className="transition-all duration-300" style={{ marginLeft: '260px' }}>
            <Topbar />
            <main className="p-6 min-h-[calc(100vh-4rem)]">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/sites" element={<Sites />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/imports" element={<Imports />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
