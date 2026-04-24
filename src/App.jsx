import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { routes } from './routes';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
            {routes.map(({ path, element, children }) => (
              <Route key={path} path={path} element={element}>
                {children && children.map(({ path: childPath, element: childElement }) => (
                  <Route key={childPath} path={childPath} element={childElement} />
                ))}
              </Route>
            ))}
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: '0.9rem' },
        }}
      />
    </div>
  );
};

export default App;
