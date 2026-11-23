import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { openSiteDialog } from "@/site-dialog"

export function openImage(trigger: HTMLAnchorElement, src: string, alt: string) {
  openSiteDialog(
    <DialogContent finalFocus={() => trigger} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl">
      <DialogTitle className="pr-8">{alt}</DialogTitle>
      <DialogDescription className="sr-only">Enlarged project image</DialogDescription>
      <img className="mx-auto max-h-[72dvh] max-w-full rounded-lg object-contain" src={src} alt={alt} />
    </DialogContent>,
  )
}
