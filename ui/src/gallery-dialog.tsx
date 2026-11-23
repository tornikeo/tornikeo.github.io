import { useRef } from "react"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PortraitGallery, type ProfilePhoto } from "@/portrait-gallery"
import { openSiteDialog } from "@/site-dialog"

function Gallery({ trigger, name, photos }: { trigger: HTMLAnchorElement; name: string; photos: ProfilePhoto[] }) {
  const title = useRef<HTMLHeadingElement>(null)
  return (
    <DialogContent initialFocus={title} finalFocus={() => trigger}
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
      <DialogHeader className="pr-8">
        <DialogTitle ref={title} tabIndex={-1}>Profile photos</DialogTitle>
        <DialogDescription className="sr-only">Photos of {name}, with a story for each.</DialogDescription>
      </DialogHeader>
      <PortraitGallery photos={photos} />
    </DialogContent>
  )
}

export function openGallery(trigger: HTMLAnchorElement, name: string, photos: ProfilePhoto[]) {
  openSiteDialog(<Gallery trigger={trigger} name={name} photos={photos} />)
}
