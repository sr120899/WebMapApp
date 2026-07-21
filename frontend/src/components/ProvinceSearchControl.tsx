import { useState } from 'react'
import { displayLabel, matchesQuery, type ProvinceOption } from '../utils/provinces'

interface ProvinceSearchControlProps {
  options: ProvinceOption[]
  searchText: string
  onSearchTextChange: (value: string) => void
  onSelect: (englishName: string) => void
}

function ProvinceSearchControl({
  options,
  searchText,
  onSearchTextChange,
  onSelect,
}: ProvinceSearchControlProps) {
  const [isFocused, setIsFocused] = useState(false)
  const filteredOptions = options.filter((option) => matchesQuery(option, searchText))

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 10000,
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          padding: '0.5rem',
        }}
      >
        <input
          type="text"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="ค้นหาจังหวัด..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '1rem',
            color: '#1f2028',
            minWidth: '220px',
          }}
        />
        {isFocused && filteredOptions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              margin: '0.25rem 0 0',
              padding: '0.25rem 0',
              listStyle: 'none',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              maxHeight: '260px',
              overflowY: 'auto',
            }}
          >
            {filteredOptions.map((option) => (
              <li key={option.englishName}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSelect(option.englishName)
                    setIsFocused(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: '#1f2028',
                  }}
                >
                  {displayLabel(option.englishName, option.thaiName)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1rem',
          zIndex: 10000,
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          padding: '0.75rem 1rem',
          fontSize: '0.9rem',
          color: '#1f2028',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>คำอธิบายสัญลักษณ์</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <span
            style={{
              width: 16,
              height: 16,
              display: 'inline-block',
              border: '2px solid #2563eb',
              background: 'rgba(37, 99, 235, 0.05)',
            }}
          />
          จังหวัดอื่น ๆ
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 16,
              height: 16,
              display: 'inline-block',
              border: '2px solid #dc2626',
              background: 'rgba(248, 113, 113, 0.45)',
            }}
          />
          จังหวัดที่เลือก
        </div>
      </div>
    </>
  )
}

export default ProvinceSearchControl
