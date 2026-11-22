import { useState } from "react"
import { createRoot } from "react-dom/client"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

type ProjectImage = { src: string; alt: string }

function ImageZoom({ src, alt }: ProjectImage) {
  return (
    <Dialog>
      <DialogTrigger className="block w-full cursor-zoom-in rounded-lg" aria-label={`Enlarge ${alt}`}>
        <img className="mx-auto max-w-full rounded-lg" src={src} alt={alt} loading="lazy" />
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogTitle className="pr-8">{alt}</DialogTitle>
        <img className="mx-auto max-h-[72dvh] max-w-full rounded-lg object-contain" src={src} alt={alt} />
      </DialogContent>
    </Dialog>
  )
}

function ImageComparison({ before, after }: { before: ProjectImage; after: ProjectImage }) {
  const [position, setPosition] = useState(50)

  return (
    <figure className="space-y-3">
      <div className="relative overflow-hidden rounded-lg">
        <img className="block w-full" {...after} loading="lazy" />
        <img
          className="absolute inset-0 size-full object-fill"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          {...before}
          loading="lazy"
        />
      </div>
      <Slider
        value={[position]}
        onValueChange={(value) => setPosition(typeof value === "number" ? value : value[0])}
        thumbLabel={`Compare ${before.alt} and ${after.alt}`}
      />
      <figcaption className="flex justify-between gap-4 text-sm text-muted-foreground">
        <span>{before.alt}</span><span className="text-right">{after.alt}</span>
      </figcaption>
    </figure>
  )
}

export function enhanceProjectMedia() {
  for (const container of document.querySelectorAll("[data-image-zoom]")) {
    const image = container.querySelector("img")
    if (image) createRoot(container).render(<ImageZoom src={image.src} alt={image.alt} />)
  }

  for (const container of document.querySelectorAll("[data-image-comparison]")) {
    const [before, after] = container.querySelectorAll("img")
    if (before && after) {
      createRoot(container).render(
        <ImageComparison before={{ src: before.src, alt: before.alt }} after={{ src: after.src, alt: after.alt }} />,
      )
    }
  }
}
