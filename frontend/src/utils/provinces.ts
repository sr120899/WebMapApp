import { thaiProvinces } from '../data/thaiProvinces'

// The province boundary dataset only has English names spelled slightly
// differently from thaiProvinces.ts (e.g. "Bangkok Metropolis", "Chon Buri"),
// so names are matched after stripping spaces/case rather than exact string match.
const NAME_ALIASES: Record<string, string> = {
  bangkokmetropolis: 'bangkok',
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, '')
}

export function thaiNameFor(englishName: string): string {
  const key = normalize(englishName)
  const target = NAME_ALIASES[key] ?? key
  return thaiProvinces.find((p) => normalize(p.nameEn) === target)?.name ?? englishName
}

export function displayLabel(englishName: string, thaiName: string): string {
  return `${thaiName} (${englishName.toUpperCase()})`
}

export interface ProvinceOption {
  englishName: string
  thaiName: string
}

export function matchesQuery(option: ProvinceOption, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return option.thaiName.toLowerCase().includes(q) || option.englishName.toLowerCase().includes(q)
}
