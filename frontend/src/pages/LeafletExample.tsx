import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import ProvinceSearchControl from '../components/ProvinceSearchControl'
import { displayLabel, thaiNameFor, type ProvinceOption } from '../utils/provinces'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_STYLE: L.PathOptions = {
  color: '#2563eb',
  weight: 1.5,
  fillColor: '#2563eb',
  fillOpacity: 0.05,
}

const SELECTED_STYLE: L.PathOptions = {
  color: '#dc2626',
  weight: 3,
  fillColor: '#f87171',
  fillOpacity: 0.45,
}

const OVERVIEW_CENTER: L.LatLngExpression = [13.7563, 100.5018]
const OVERVIEW_ZOOM = 6

function LeafletExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersByProvinceRef = useRef<Record<string, L.Polygon>>({})
  const suppressResetRef = useRef(false)
  const [searchText, setSearchText] = useState('')
  const [options, setOptions] = useState<ProvinceOption[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, { zoomControl: false }).setView(OVERVIEW_CENTER, OVERVIEW_ZOOM)
    mapRef.current = map
    L.control.zoom({ position: 'topright' }).addTo(map)

    map.on('popupclose', () => {
      if (suppressResetRef.current) return
      resetToOverview()
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    fetch(`${import.meta.env.BASE_URL}data/thailand-provinces.geojson`)
      .then((res) => res.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const layers: Record<string, L.Polygon> = {}
        const provinceOptions: ProvinceOption[] = []

        L.geoJSON(geojson, {
          style: DEFAULT_STYLE,
          onEachFeature: (feature, layer) => {
            const englishName = feature.properties?.name as string
            const polygon = layer as L.Polygon
            layers[englishName] = polygon
            provinceOptions.push({ englishName, thaiName: thaiNameFor(englishName) })
            polygon.on('click', () => selectProvince(englishName))
          },
        }).addTo(map)

        provinceOptions.sort((a, b) => a.thaiName.localeCompare(b.thaiName, 'th'))

        layersByProvinceRef.current = layers
        setOptions(provinceOptions)
      })
      .catch((err) => console.error('Failed to load province boundaries', err))

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetToOverview() {
    for (const layer of Object.values(layersByProvinceRef.current)) {
      layer.setStyle(DEFAULT_STYLE)
    }
    setSearchText('')
    mapRef.current?.flyTo(OVERVIEW_CENTER, OVERVIEW_ZOOM)
  }

  function selectProvince(englishName: string) {
    const map = mapRef.current
    if (!map) return

    suppressResetRef.current = true
    for (const layer of Object.values(layersByProvinceRef.current)) {
      layer.setStyle(DEFAULT_STYLE)
      layer.closePopup()
    }
    suppressResetRef.current = false

    const selectedLayer = layersByProvinceRef.current[englishName]
    if (!selectedLayer) return

    const thaiName = thaiNameFor(englishName)
    selectedLayer.setStyle(SELECTED_STYLE)
    selectedLayer.bringToFront()
    selectedLayer.bindPopup(`<strong>${thaiName}</strong><br/>${englishName}`).openPopup()
    map.fitBounds(selectedLayer.getBounds(), { padding: [20, 20] })

    setSearchText(displayLabel(englishName, thaiName))
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ProvinceSearchControl
        options={options}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSelect={selectProvince}
      />
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default LeafletExample
