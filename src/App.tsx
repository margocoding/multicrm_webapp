// src/App.tsx
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Imports } from './pages/Imports';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { Products } from './pages/Products';
import { Settings } from './pages/Settings';
import { Sites } from './pages/Sites';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer toastClassName="app-toast" autoClose={2500} theme="dark" />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-[#0B1120] bg-grid-pattern">
                    <div className="fixed inset-0 bg-linear-to-br from-[#0B1120] via-[#0B1120]/95 to-[#111827] pointer-events-none"></div>
                    <div className="relative z-10">
                      <Sidebar />
                      <div className="transition-all duration-300 lg:ml-65 ml-0">
                        <Topbar />
                        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)] pt-20 lg:pt-0">
                          <AnimatePresence mode="wait">
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/sites" element={<Sites />} />
                              <Route path="/products" element={<Products />} />
                              <Route path="/imports" element={<Imports />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/orders" element={<Orders />} />
                              <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                              />
                            </Routes>
                          </AnimatePresence>
                        </main>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;