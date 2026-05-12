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
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="transition-all duration-300" style={{ marginLeft: '260px' }}>
          <Topbar />
          <main className="p-6">
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
    </BrowserRouter>
  );
}

export default App;
