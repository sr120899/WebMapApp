import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import ProvinceSearchControl from '../components/ProvinceSearchControl'
import { displayLabel, thaiNameFor, type ProvinceOption } from '../utils/provinces'

interface ProvinceFeature {
  id: number
  feature: GeoJSON.Feature
}

function boundsOfGeometry(geometry: GeoJSON.Geometry): [[number, number], [number, number]] {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return
    if (typeof coords[0] === 'number') {
      const [x, y] = coords as [number, number]
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    } else {
      coords.forEach(visit)
    }
  }

  visit((geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon).coordinates)
  return [
    [minX, minY],
    [maxX, maxY],
  ]
}

const OVERVIEW_CENTER: [number, number] = [100.5018, 13.7563]
const OVERVIEW_ZOOM = 5

function MaplibreExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const featuresByProvinceRef = useRef<Record<string, ProvinceFeature>>({})
  const selectedIdRef = useRef<number | null>(null)
  const suppressResetRef = useRef(false)
  const [searchText, setSearchText] = useState('')
  const [options, setOptions] = useState<ProvinceOption[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: OVERVIEW_CENTER,
      zoom: OVERVIEW_ZOOM,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', () => {
      fetch(`${import.meta.env.BASE_URL}data/thailand-provinces.geojson`)
        .then((res) => res.json())
        .then((geojson: GeoJSON.FeatureCollection) => {
          const byProvince: Record<string, ProvinceFeature> = {}
          const provinceOptions: ProvinceOption[] = []

          geojson.features.forEach((feature, index) => {
            const englishName = feature.properties?.name as string
            byProvince[englishName] = { id: index, feature }
            provinceOptions.push({ englishName, thaiName: thaiNameFor(englishName) })
          })
          provinceOptions.sort((a, b) => a.thaiName.localeCompare(b.thaiName, 'th'))

          featuresByProvinceRef.current = byProvince
          setOptions(provinceOptions)

          map.addSource('provinces', {
            type: 'geojson',
            data: geojson,
            generateId: true,
          })

          map.addLayer({
            id: 'provinces-fill',
            type: 'fill',
            source: 'provinces',
            paint: {
              'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#f87171', '#2563eb'],
              'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 0.45, 0.05],
            },
          })

          map.addLayer({
            id: 'provinces-line',
            type: 'line',
            source: 'provinces',
            paint: {
              'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#dc2626', '#2563eb'],
              'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, 1.5],
            },
          })

          map.on('click', 'provinces-fill', (e) => {
            const englishName = e.features?.[0]?.properties?.name as string | undefined
            if (englishName) selectProvince(englishName, e.lngLat)
          })
          map.on('mouseenter', 'provinces-fill', () => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', 'provinces-fill', () => {
            map.getCanvas().style.cursor = ''
          })
        })
        .catch((err) => console.error('Failed to load province boundaries', err))
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetToOverview() {
    const map = mapRef.current
    if (!map) return

    if (selectedIdRef.current !== null) {
      map.setFeatureState({ source: 'provinces', id: selectedIdRef.current }, { selected: false })
      selectedIdRef.current = null
    }
    setSearchText('')
    map.flyTo({ center: OVERVIEW_CENTER, zoom: OVERVIEW_ZOOM })
  }

  function selectProvince(englishName: string, clickLngLat?: maplibregl.LngLat) {
    const map = mapRef.current
    const entry = featuresByProvinceRef.current[englishName]
    if (!map || !entry) return

    if (selectedIdRef.current !== null) {
      map.setFeatureState({ source: 'provinces', id: selectedIdRef.current }, { selected: false })
    }
    map.setFeatureState({ source: 'provinces', id: entry.id }, { selected: true })
    selectedIdRef.current = entry.id

    const bounds = boundsOfGeometry(entry.feature.geometry)
    map.fitBounds(bounds, { padding: 40, duration: 500 })

    const thaiName = thaiNameFor(englishName)
    const lngLat: [number, number] = clickLngLat
      ? [clickLngLat.lng, clickLngLat.lat]
      : [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]

    suppressResetRef.current = true
    popupRef.current?.remove()
    suppressResetRef.current = false

    const popup = new maplibregl.Popup({ closeOnClick: false })
      .setLngLat(lngLat)
      .setHTML(`<strong>${thaiName}</strong><br/>${englishName}`)
      .addTo(map)
    popup.on('close', () => {
      if (suppressResetRef.current) return
      resetToOverview()
    })
    popupRef.current = popup

    setSearchText(displayLabel(englishName, thaiName))
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ProvinceSearchControl
        options={options}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSelect={(englishName) => selectProvince(englishName)}
      />
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default MaplibreExample
