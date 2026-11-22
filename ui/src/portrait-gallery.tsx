import { useCallback, useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"

import { Button } from "@/components/ui/button"
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export type ProfilePhoto = {
  image: string
  title: string
  alt: string
  story: string
  link?: { label: string; href: string }
}

export function PortraitGallery({ photos }: { photos: ProfilePhoto[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [autoplay] = useState(() => Autoplay({
    delay: 8500,
    playOnInit: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    stopOnMouseEnter: true,
    stopOnInteraction: true,
  }))

  const connect = useCallback((carouselApi: CarouselApi) => {
    setApi(carouselApi)
    setPlaying(autoplay.isPlaying())
  }, [autoplay])

  useEffect(() => {
    if (!api) return

    const selectPhoto = () => setSelected(api.selectedScrollSnap())
    const startPlayback = () => setPlaying(true)
    const stopPlayback = () => setPlaying(false)
    api.on("select", selectPhoto)
    api.on("autoplay:play", startPlayback)
    api.on("autoplay:stop", stopPlayback)

    return () => {
      api.off("select", selectPhoto)
      api.off("autoplay:play", startPlayback)
      api.off("autoplay:stop", stopPlayback)
    }
  }, [api])

  const photo = photos[selected]

  return (
    <Carousel
      aria-label="Profile photos"
      className="grid min-w-0 gap-3"
      opts={{ loop: true, breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } } }}
      plugins={[autoplay]}
      setApi={connect}
    >
      <CarouselContent>
        {photos.map((slide, index) => (
          <CarouselItem
            key={slide.image}
            aria-label={`${index + 1} of ${photos.length}`}
            aria-hidden={index !== selected}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
              className="h-[min(50dvh,28rem)] w-full rounded-md bg-muted object-contain"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CarouselPrevious className="static m-0" onClickCapture={() => autoplay.stop()} />
          <CarouselNext className="static m-0" onClickCapture={() => autoplay.stop()} />
          <span className="text-xs tabular-nums text-muted-foreground">{selected + 1} / {photos.length}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!api}
          onClick={() => { if (autoplay.isPlaying()) autoplay.stop(); else autoplay.play() }}
        >
          {playing ? "Pause slideshow" : "Play slideshow"}
        </Button>
      </div>
      <div aria-live={playing ? "off" : "polite"} className="grid gap-1">
        <h2 className="font-medium">{photo.title}</h2>
        <p className="text-muted-foreground">{photo.story}</p>
        {photo.link && (
          <a className="w-fit underline underline-offset-4" href={photo.link.href}>
            {photo.link.label}
          </a>
        )}
      </div>
    </Carousel>
  )
}
