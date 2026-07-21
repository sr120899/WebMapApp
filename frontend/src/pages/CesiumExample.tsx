import { useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

function CesiumExample() {
  const containerRef = useRef<HTMLDivElement>(null)

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
    })

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(100.5018, 13.7563, 1500000),
    })

    return () => viewer.destroy()
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
}

export default CesiumExample
