import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShiftForm from './pages/ShiftForm';
import ShiftUsers from './pages/ShiftUsers';

export function App() {
  // Uygulamanın 4217 portundan bağımsız çalışıp çalışmadığını kontrol ediyoruz.
  const isStandalone = window.location.port === '4217';
  const basename = isStandalone ? '/' : '/app/shift-app';

  return (
    <HashRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/shift-form" replace />} />
        <Route path="/shift-form" element={<ShiftForm />} />
        <Route path="/shift-users" element={<ShiftUsers />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
