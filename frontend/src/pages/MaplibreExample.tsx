import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

function MaplibreExample() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [100.5018, 13.7563],
      zoom: 5,
    })

    map.addControl(new maplibregl.NavigationControl())
    new maplibregl.Marker().setLngLat([100.5018, 13.7563]).addTo(map)

    return () => map.remove()
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
}

export default MaplibreExample
