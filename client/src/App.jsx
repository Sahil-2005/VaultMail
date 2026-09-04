import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VaultUpload from './pages/VaultUpload';
import VaultBrowser from './pages/VaultBrowser';
import ComposePage from './pages/ComposePage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<VaultUpload />} />
          <Route path="vault" element={<VaultBrowser />} />
          <Route path="compose" element={<ComposePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
