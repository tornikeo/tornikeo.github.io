import { useCallback, useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  }))

  const connect = useCallback((carouselApi: CarouselApi) => {
    setApi(carouselApi)
    setPlaying(autoplay.isPlaying())
  }, [autoplay])

  useEffect(() => {
    if (!api) return
    const start = () => setPlaying(true)
    const stop = () => setPlaying(false)
    const select = () => setSelected(api.selectedScrollSnap())
    api.on("autoplay:play", start).on("autoplay:stop", stop)
    api.on("select", select)
    return () => {
      api.off("autoplay:play", start).off("autoplay:stop", stop).off("select", select)
    }
  }, [api])

  return (
    <>
      <div className="px-6 sm:px-12">
        <Carousel
          aria-label="Profile photos"
          className="w-full"
          opts={{ loop: true, breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } } }}
          plugins={[autoplay]}
          setApi={connect}
        >
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={photo.image} inert={index !== selected}>
                <div className="p-1">
                  <Card>
                    <img
                      src={photo.image}
                      alt={photo.alt}
                      draggable={false}
                      className="h-[min(42dvh,24rem)] w-full bg-muted object-contain"
                    />
                    <CardHeader>
                      <CardTitle>{photo.title}</CardTitle>
                      <CardDescription>
                        {photo.story}
                        {photo.link && (
                          <>
                            {" "}
                            <a className="underline underline-offset-4" href={photo.link.href}>{photo.link.label}</a>
                          </>
                        )}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-7 sm:-left-12" onClickCapture={() => autoplay.stop()} />
          <CarouselNext className="-right-7 sm:-right-12" onClickCapture={() => autoplay.stop()} />
        </Carousel>
      </div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!api}
          onClick={() => { if (autoplay.isPlaying()) autoplay.stop(); else autoplay.play() }}
        >
          {playing ? "Pause slideshow" : "Play slideshow"}
        </Button>
      </div>
    </>
  )
}
