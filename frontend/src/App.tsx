import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LeafletExample from './pages/LeafletExample'
import MaplibreExample from './pages/MaplibreExample'
import CesiumExample from './pages/CesiumExample'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leaflet" element={<LeafletExample />} />
      <Route path="/maplibre" element={<MaplibreExample />} />
      <Route path="/cesium" element={<CesiumExample />} />
    </Routes>
  )
}

export default App
