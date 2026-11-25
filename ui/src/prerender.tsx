import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"
import { parseHTML } from "linkedom"
import { renderToStaticMarkup, renderToString } from "react-dom/server"

import { ImageComparison, readComparisons } from "@/image-comparison"
import { SiteNavigation } from "@/navigation"
import { Profile, type SiteLink } from "@/profile"
import { renderSiteContent } from "@/site-content"

function readLinks(container: Element | null): SiteLink[] {
  return Array.from(container?.querySelectorAll("a") ?? [], (anchor) => {
    const current = anchor.getAttribute("aria-current")
    return {
      label: anchor.textContent.trim(),
      href: anchor.getAttribute("href") ?? "",
      current: current === "page" || current === "location" ? current : undefined,
    }
  })
}

function renderPage(document: Document) {
  const navigation = document.querySelector("[data-site-navigation]")
  if (!navigation) return false

  navigation.innerHTML = renderToStaticMarkup(
    <SiteNavigation links={readLinks(navigation)} hasTheme={Boolean(document.getElementById("site-theme"))} />,
  )

  const profile = document.querySelector<HTMLElement>("[data-site-profile]")
  const bio = profile?.querySelector("[data-profile-bio]")
  const firstPhoto = profile?.querySelector("figure a")?.getAttribute("href")
  if (profile && bio && firstPhoto) {
    const { name, avatar, caption, date, dateLabel, pronunciation } = profile.dataset
    if (name && avatar && caption) {
      profile.innerHTML = renderToStaticMarkup(
        <Profile
          name={name}
          avatar={avatar}
          firstPhoto={firstPhoto}
          caption={caption}
          date={date}
          dateLabel={dateLabel}
          pronunciation={pronunciation}
          bioHtml={bio.innerHTML}
          contacts={readLinks(profile.querySelector("[data-profile-contacts]"))}
        />,
      )
    }
  }

  renderSiteContent(document)
  document.querySelectorAll<HTMLElement>("[data-image-comparison]").forEach((container, index) => {
    const images = readComparisons(container)
    if (images) {
      const identifierPrefix = `compare-${index}-`
      container.dataset.comparisonId = identifierPrefix
      container.innerHTML = renderToString(<ImageComparison {...images} />, { identifierPrefix })
    }
  })
  return true
}

const destination = process.argv[2]
if (!destination) throw new Error("Jekyll output directory is required")

for (const file of readdirSync(destination, { recursive: true, encoding: "utf8" })) {
  if (!file.endsWith(".html")) continue
  const path = join(destination, file)
  const { document } = parseHTML(readFileSync(path, "utf8"))
  if (renderPage(document)) writeFileSync(path, document.toString())
}
