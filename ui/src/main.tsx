import { createRoot } from "react-dom/client"

import { SiteNavigation } from "@/navigation"
import { Profile } from "@/profile"
import type { SiteLink } from "@/profile"
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
  const { name, avatar, portrait, caption, date, dateLabel, pronunciation } = profile.dataset
  if (name && avatar && portrait && caption && date && dateLabel) {
    const contacts = readLinks(profile.querySelector("[data-profile-contacts]"))
    createRoot(profile).render(
      <Profile
        name={name}
        avatar={avatar}
        portrait={portrait}
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
