import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import ProductFormPage from './pages/ProductFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/create" element={<ProductFormPage />} />
      <Route path="/edit/:id" element={<ProductFormPage />} />
    </Routes>
  )
}

export default App
