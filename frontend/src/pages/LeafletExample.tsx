import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { thaiProvinces } from '../data/thaiProvinces'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function LeafletExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [selectedProvince, setSelectedProvince] = useState('')

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current).setView([13.7563, 100.5018], 6)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    L.marker([13.7563, 100.5018]).addTo(map).bindPopup('Bangkok, Thailand')

    // Country boundary from Example/Thailand.geojson (the only usable key is
    // the "Thailand" property; the dataset has no per-province breakdown).
    fetch('/data/thailand-boundary.geojson')
      .then((res) => res.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        L.geoJSON(geojson, {
          style: {
            color: '#2563eb',
            weight: 2,
            fill: false,
          },
        }).addTo(map)
      })
      .catch((err) => console.error('Failed to load Thailand boundary', err))

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = event.target.value
    setSelectedProvince(provinceName)

    const province = thaiProvinces.find((p) => p.name === provinceName)
    if (province && mapRef.current) {
      mapRef.current.flyTo([province.lat, province.lng], province.zoom)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          padding: '0.5rem',
        }}
      >
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '1rem',
            color: '#1f2028',
            minWidth: '180px',
          }}
        >
          <option value="" disabled>
            เลือกจังหวัด
          </option>
          {thaiProvinces.map((province) => (
            <option key={province.name} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default LeafletExample
