import { cpSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(scriptDir, '../dist')
const targetDir = path.resolve(scriptDir, '../../backend/app/static')

if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true })
}
cpSync(distDir, targetDir, { recursive: true })

console.log(`Copied ${distDir} -> ${targetDir}`)
