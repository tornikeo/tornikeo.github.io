import { readFileSync, writeFileSync } from "node:fs"

const inputPath = new URL("../../assets/shadcn/.vite/manifest.json", import.meta.url)
const outputPath = new URL("../../_data/shadcn_assets.json", import.meta.url)
const manifest = JSON.parse(readFileSync(inputPath, "utf8"))
const entry = manifest["src/runtime.ts"]
const font = entry.assets?.find((file) => file.endsWith(".woff2"))

writeFileSync(outputPath, JSON.stringify({
  font: font ? `/assets/shadcn/${font}` : undefined,
  script: `/assets/shadcn/${entry.file}`,
  styles: entry.css.map((file) => `/assets/shadcn/${file}`),
}) + "\n")
