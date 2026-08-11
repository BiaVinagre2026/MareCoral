import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LegalPage from './pages/LegalPage.tsx'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route
        path="/politica-de-privacidade"
        element={<LegalPage type="privacy" />}
      />
      <Route
        path="/trocas-e-devolucoes"
        element={<LegalPage type="exchanges" />}
      />
    </Routes>
  )
}

export default App
