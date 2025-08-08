import { Link, Route, Routes } from 'react-router-dom';
import { DataProvider } from '../state/DataContext';
import ItemDetail from './ItemDetail';
import Items from './Items';

function App() {
  return (
    <DataProvider>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              Items Store
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                Browse Items
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </main>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.6;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          background-color: #fff;
          border-bottom: 1px solid #dee2e6;
          padding: 0 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
        }

        .nav-brand {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s;
        }

        .nav-brand:hover {
          color: #0056b3;
        }

        .nav-links {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #007bff;
        }

        .main-content {
          flex: 1;
          padding: 20px;
        }

        /* Global button styles */
        button {
          font-family: inherit;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 16px;
          }
          
          .main-content {
            padding: 16px;
          }
        }
      `}</style>
    </DataProvider>
  );
}

export default App;