import type { ReactNode } from "react"
import { createRoot } from "react-dom/client"

import { Dialog } from "@/components/ui/dialog"

export function openSiteDialog(content: ReactNode) {
  if (document.querySelector("[data-site-dialog]")) return

  const container = document.createElement("div")
  container.dataset.siteDialog = ""
  document.body.append(container)
  const root = createRoot(container)
  root.render(
    <Dialog defaultOpen onOpenChangeComplete={(open) => {
      if (open) return
      queueMicrotask(() => {
        root.unmount()
        container.remove()
      })
    }}>
      {content}
    </Dialog>,
  )
}
