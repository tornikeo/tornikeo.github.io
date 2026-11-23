import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import type { SiteLink } from "@/profile"

export function SiteNavigation({ links, hasTheme }: { links: SiteLink[]; hasTheme: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1">
      <NavigationMenu aria-label="Main">
        <NavigationMenuList className="flex-wrap gap-0 sm:gap-1">
          {links.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink active={Boolean(link.current)} render={<a href={link.href} aria-current={link.current} />}>
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {hasTheme && (
        <Button variant="ghost" size="icon-sm" aria-label="Dark mode" aria-pressed={false} data-theme-toggle>
          <MoonIcon aria-hidden="true" className="dark:hidden" />
          <SunIcon aria-hidden="true" className="hidden dark:block" />
        </Button>
      )}
    </div>
  )
}
