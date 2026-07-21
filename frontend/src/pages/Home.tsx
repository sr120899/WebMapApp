import { Link } from 'react-router-dom'

function Home() {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>WebMapApp</h1>
      <p>Web map API examples</p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
        <li>
          <Link to="/leaflet">Leaflet example</Link>
        </li>
        <li>
          <Link to="/maplibre">MapLibre GL JS example</Link>
        </li>
        <li>
          <Link to="/cesium">CesiumJS example</Link>
        </li>
      </ul>
    </section>
  )
}

export default Home
