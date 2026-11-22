import { createRoot } from "react-dom/client"

import { SiteNavigation } from "@/navigation"
import { Profile } from "@/profile"
import type { SiteLink } from "@/profile"
import type { ProfilePhoto } from "@/portrait-gallery"
import { enhanceProjectMedia } from "@/project-media"
import { enhanceSiteContent } from "@/site-content"
import "./index.css"

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

const navigation = document.querySelector("[data-site-navigation]")
if (navigation) {
  const links = readLinks(navigation)
  createRoot(navigation).render(<SiteNavigation links={links} />)
}

const profile = document.querySelector<HTMLElement>("[data-site-profile]")
const bio = profile?.querySelector("[data-profile-bio]")
if (profile && bio) {
  const { name, avatar, photos, photoRoot, caption, date, dateLabel, pronunciation } = profile.dataset
  if (name && avatar && photos && photoRoot && caption && date && dateLabel) {
    const gallery = (JSON.parse(photos) as ProfilePhoto[]).map((photo) => ({
      ...photo,
      image: photoRoot + photo.image,
    }))
    const contacts = readLinks(profile.querySelector("[data-profile-contacts]"))
    createRoot(profile).render(
      <Profile
        name={name}
        avatar={avatar}
        photos={gallery}
        caption={caption}
        date={date}
        dateLabel={dateLabel}
        pronunciation={pronunciation}
        bioHtml={bio.innerHTML}
        contacts={contacts}
      />,
    )
  }
}

enhanceSiteContent()
enhanceProjectMedia()
