import { Link } from 'react-router-dom'
import './Home.css'

const examples = [
  {
    to: '/leaflet',
    name: 'Leaflet',
    description: 'Open-source JavaScript library for interactive maps',
    variant: 'leaflet',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#4ade80" strokeWidth="1.5">
        <path d="M4 20c8 0 16-4 16-16-12 0-16 8-16 16Z" />
        <path d="M4.5 19.5C8 16 12 12 19.5 4.5" />
      </svg>
    ),
  },
  {
    to: '/maplibre',
    name: 'MapLibre GL JS',
    description: 'Community-driven vector map engine',
    variant: 'maplibre',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#7ee8fa">
        <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
      </svg>
    ),
  },
  {
    to: '/cesium',
    name: 'CesiumJS',
    description: '3D Globe and Map library for the web',
    variant: 'cesium',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#a78bfa" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c3 3 3 15 0 18" />
        <path d="M12 3c-3 3-3 15 0 18" />
      </svg>
    ),
  },
]

function CardPreview({ variant }: { variant: string }) {
  if (variant === 'leaflet') {
    return (
      <div className="preview preview--leaflet">
        <div className="preview__zoom">
          <span>+</span>
          <span>-</span>
        </div>
        <div className="preview__layers" />
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`preview__pin preview__pin--${i}`} />
        ))}
      </div>
    )
  }

  if (variant === 'maplibre') {
    return (
      <div className="preview preview--maplibre">
        <div className="preview__sheet preview__sheet--1" />
        <div className="preview__sheet preview__sheet--2" />
        <div className="preview__sheet preview__sheet--3" />
      </div>
    )
  }

  return (
    <div className="preview preview--cesium">
      <div className="preview__globe" />
    </div>
  )
}

function Home() {
  return (
    <section className="home">
      <div className="home__content">
        <div className="home__title-wrap">
          <h1 className="home__title">Web Map Application</h1>
        </div>
        <p className="home__subtitle">
          สำรวจตัวอย่างการใช้งาน Web Map API ต่าง ๆ และเลือกแผนที่ที่คุณต้องการด้านล่าง
        </p>
        <div className="home__cards">
          {examples.map((example) => (
            <Link to={example.to} key={example.to} className="home__card">
              <div className="home__card-header">
                {example.icon}
                <h2>{example.name}</h2>
              </div>
              <CardPreview variant={example.variant} />
              <p className="home__card-description">{example.description}</p>
              <span className="home__card-button">Explore</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
