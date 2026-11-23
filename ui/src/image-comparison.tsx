import { useState } from "react"
import { hydrateRoot } from "react-dom/client"

import { Slider } from "@/components/ui/slider"

type ProjectImage = { src: string; alt: string; width?: number; height?: number }

export function ImageComparison({ before, after }: { before: ProjectImage; after: ProjectImage }) {
  const [position, setPosition] = useState(50)

  return (
    <figure className="space-y-3">
      <div className="relative overflow-hidden rounded-lg">
        <img className="block w-full" {...after} loading="lazy" data-after />
        <img
          className="absolute inset-0 size-full object-fill"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          {...before}
          data-before
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

function readImage(image: HTMLImageElement): ProjectImage {
  return {
    src: image.getAttribute("src") ?? "",
    alt: image.alt,
    width: Number(image.getAttribute("width")) || undefined,
    height: Number(image.getAttribute("height")) || undefined,
  }
}

export function readComparisons(container: Element) {
  const before = container.querySelector<HTMLImageElement>("img[data-before]")
  const after = container.querySelector<HTMLImageElement>("img[data-after]")
  if (before && after) {
    return {
      before: readImage(before),
      after: readImage(after),
    }
  }
}

export function hydrateComparison(container: HTMLElement) {
  const images = readComparisons(container)
  if (images) {
    hydrateRoot(container, <ImageComparison {...images} />, { identifierPrefix: container.dataset.comparisonId })
  }
}
