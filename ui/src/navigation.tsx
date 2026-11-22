import { useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import type { SiteLink } from "@/profile"

declare global {
  interface Window {
    toggleSiteTheme?: () => void
  }
}

export function SiteNavigation({ links }: { links: SiteLink[] }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))

  return (
    <div className="flex flex-wrap items-center justify-between gap-1">
      <NavigationMenu aria-label="Main">
        <NavigationMenuList className="flex-wrap gap-0 sm:gap-1">
          {links.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                active={Boolean(link.current)}
                render={<a href={link.href} aria-current={link.current} />}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {window.toggleSiteTheme && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Dark mode"
          aria-pressed={dark}
          onClick={() => {
            window.toggleSiteTheme?.()
            setDark(document.documentElement.classList.contains("dark"))
          }}
        >
          {dark ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
        </Button>
      )}
    </div>
  )
}
