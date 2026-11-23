import type { ProfilePhoto } from "@/portrait-gallery"
import "./index.css"

declare global {
  interface Window {
    toggleSiteTheme?: () => void
  }
}

const themeButton = document.querySelector<HTMLButtonElement>("[data-theme-toggle]")
if (themeButton) {
  const syncThemeButton = () => themeButton.setAttribute("aria-pressed", String(document.documentElement.classList.contains("dark")))
  syncThemeButton()
  themeButton.addEventListener("click", () => {
    window.toggleSiteTheme?.()
    syncThemeButton()
  })
}

const audio = document.querySelector<HTMLAudioElement>("[data-site-profile] audio")
const name = document.querySelector<HTMLButtonElement>("[data-play-name]")
if (audio && name) {
  name.addEventListener("click", () => {
    if (!audio.paused) return
    audio.currentTime = 0
    void audio.play().catch(() => {})
  })
  audio.addEventListener("playing", () => { name.dataset.playing = "" })
  for (const event of ["ended", "pause", "error"]) {
    audio.addEventListener(event, () => { delete name.dataset.playing })
  }
}

const galleryLink = document.querySelector<HTMLAnchorElement>("[data-open-gallery]")
const profile = document.querySelector<HTMLElement>("[data-site-profile]")
if (galleryLink && profile) {
  const { name, photos, photoRoot } = profile.dataset
  if (name && photos && photoRoot) {
    galleryLink.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      const gallery = (JSON.parse(photos) as ProfilePhoto[]).map((photo) => ({
        ...photo,
        image: photoRoot + photo.image,
      }))
      void import("./gallery-dialog").then(({ openGallery }) => openGallery(galleryLink, name, gallery))
        .catch(() => window.location.assign(galleryLink.href))
    })
  }
}

for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-image-zoom] a")) {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const alt = link.querySelector("img")?.alt ?? "Project image"
    void import("./image-dialog").then(({ openImage }) => openImage(link, link.href, alt))
      .catch(() => window.location.assign(link.href))
  })
}

if (document.querySelector("[data-comparison-id]")) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer.unobserve(entry.target)
      void import("./image-comparison").then(({ hydrateComparison }) => hydrateComparison(entry.target as HTMLElement))
    }
  }, { rootMargin: "200px" })
  document.querySelectorAll("[data-comparison-id]").forEach((element) => observer.observe(element))
}
