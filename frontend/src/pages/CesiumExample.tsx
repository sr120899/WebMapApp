import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import ProvinceSearchControl from '../components/ProvinceSearchControl'
import { displayLabel, thaiNameFor, type ProvinceOption } from '../utils/provinces'

const DEFAULT_FILL = Cesium.Color.fromCssColorString('#2563eb').withAlpha(0.05)
const DEFAULT_OUTLINE = Cesium.Color.fromCssColorString('#2563eb')
const SELECTED_FILL = Cesium.Color.fromCssColorString('#f87171').withAlpha(0.45)
const SELECTED_OUTLINE = Cesium.Color.fromCssColorString('#dc2626')

function styleEntity(entity: Cesium.Entity, selected: boolean) {
  if (!entity.polygon) return
  entity.polygon.material = new Cesium.ColorMaterialProperty(selected ? SELECTED_FILL : DEFAULT_FILL)
  entity.polygon.outlineColor = new Cesium.ConstantProperty(selected ? SELECTED_OUTLINE : DEFAULT_OUTLINE)
  entity.polygon.outlineWidth = new Cesium.ConstantProperty(selected ? 3 : 1.5)
}

const OVERVIEW_DESTINATION = Cesium.Cartesian3.fromDegrees(100.5018, 13.7563, 1500000)

function CesiumExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const entitiesByProvinceRef = useRef<Record<string, Cesium.Entity>>({})
  const selectedEntityRef = useRef<Cesium.Entity | null>(null)
  const [searchText, setSearchText] = useState('')
  const [options, setOptions] = useState<ProvinceOption[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayer: new Cesium.ImageryLayer(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://tile.openstreetmap.org/',
        }),
      ),
      baseLayerPicker: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      timeline: false,
      animation: false,
      geocoder: false,
      sceneModePicker: false,
      homeButton: false,
      fullscreenButton: false,
      navigationHelpButton: false,
    })
    viewerRef.current = viewer

    viewer.camera.flyTo({ destination: OVERVIEW_DESTINATION })

    viewer.selectedEntityChanged.addEventListener((entity) => {
      if (!entity) {
        resetToOverview()
        return
      }
      const props = entity.properties?.getValue(Cesium.JulianDate.now())
      const englishName = props?.name as string | undefined
      if (englishName) applySelection(englishName)
    })

    Cesium.GeoJsonDataSource.load(`${import.meta.env.BASE_URL}data/thailand-provinces.geojson`, {
      stroke: DEFAULT_OUTLINE,
      fill: DEFAULT_FILL,
      strokeWidth: 1.5,
      clampToGround: true,
    })
      .then((dataSource) => {
        viewer.dataSources.add(dataSource)

        const entities: Record<string, Cesium.Entity> = {}
        const provinceOptions: ProvinceOption[] = []

        dataSource.entities.values.forEach((entity) => {
          const props = entity.properties?.getValue(Cesium.JulianDate.now())
          const englishName = props?.name as string | undefined
          if (!englishName) return

          entities[englishName] = entity
          provinceOptions.push({ englishName, thaiName: thaiNameFor(englishName) })
          entity.description = new Cesium.ConstantProperty(
            `<strong>${thaiNameFor(englishName)}</strong><br/>${englishName}`,
          )
        })

        provinceOptions.sort((a, b) => a.thaiName.localeCompare(b.thaiName, 'th'))
        entitiesByProvinceRef.current = entities
        setOptions(provinceOptions)
      })
      .catch((err) => console.error('Failed to load province boundaries', err))

    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetToOverview() {
    const previous = selectedEntityRef.current
    if (previous) {
      styleEntity(previous, false)
      selectedEntityRef.current = null
    }
    setSearchText('')
    viewerRef.current?.camera.flyTo({ destination: OVERVIEW_DESTINATION })
  }

  function applySelection(englishName: string) {
    const entity = entitiesByProvinceRef.current[englishName]
    if (!entity) return

    const previous = selectedEntityRef.current
    if (previous && previous !== entity) {
      styleEntity(previous, false)
    }
    styleEntity(entity, true)
    selectedEntityRef.current = entity

    viewerRef.current?.flyTo(entity, { duration: 1 })
    setSearchText(displayLabel(englishName, thaiNameFor(englishName)))
  }

  function selectProvince(englishName: string) {
    const viewer = viewerRef.current
    const entity = entitiesByProvinceRef.current[englishName]
    if (!viewer || !entity) return
    viewer.selectedEntity = entity
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

export default CesiumExample
