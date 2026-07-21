import { Link } from 'react-router-dom'
import './Home.css'

const examples = [
  { to: '/leaflet', label: 'Leaflet' },
  { to: '/maplibre', label: 'MapLibre GL JS' },
  { to: '/cesium', label: 'CesiumJS' },
]

function Home() {
  return (
    <section className="home">
      <div className="home__content">
        <h1 className="home__title">WebMapApp</h1>
        <p className="home__subtitle">
          สำรวจตัวอย่างการใช้งาน Web Map API ต่าง ๆ เลือกไปยังหน้าที่ต้องการด้านล่าง
        </p>
        <ul className="home__nav">
          {examples.map((example) => (
            <li key={example.to}>
              <Link to={example.to} className="home__button">
                <span className="home__button-label">{example.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home
