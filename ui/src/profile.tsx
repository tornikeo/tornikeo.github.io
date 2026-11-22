import { useRef, useState } from "react"
import { ArrowUpRightIcon, Volume2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { PortraitGallery, type ProfilePhoto } from "@/portrait-gallery"

export type SiteLink = { label: string; href: string; current?: "page" | "location" }

type ProfileProps = {
  name: string
  avatar: string
  photos: ProfilePhoto[]
  caption: string
  date: string
  dateLabel: string
  pronunciation?: string
  bioHtml: string
  contacts: SiteLink[]
}

function Portrait({ name, avatar, photos, caption, date, dateLabel }: ProfileProps) {
  const title = useRef<HTMLHeadingElement>(null)

  return (
    <figure className="shrink-0">
      <Dialog>
        <DialogTrigger aria-label={`View profile photos of ${name}`} className="rounded-full focus-visible:outline-2">
          <Avatar className="size-16">
            <AvatarImage src={avatar} alt="" className="object-[center_64%]" />
            <AvatarFallback>TO</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent initialFocus={title} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="pr-8">
            <DialogTitle ref={title} tabIndex={-1}>Profile photos</DialogTitle>
            <DialogDescription className="sr-only">Photos of {name}, with a story for each.</DialogDescription>
          </DialogHeader>
          <PortraitGallery photos={photos} />
        </DialogContent>
      </Dialog>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        {caption}<time className="block" dateTime={date}>{dateLabel}</time>
      </figcaption>
    </figure>
  )
}

function Name({ name, pronunciation }: Pick<ProfileProps, "name" | "pronunciation">) {
  const player = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  function play() {
    const audio = player.current
    if (!audio?.paused) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  if (!pronunciation) return <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>

  return (
    <>
      <h1>
        <Button
          variant="ghost"
          className="h-auto justify-start px-2 py-1 text-left text-2xl font-semibold tracking-tight whitespace-normal sm:text-3xl"
          onClick={play}
          aria-label={`${name}: play pronunciation`}
        >
          {name}
          <Volume2Icon aria-hidden="true" className={playing ? "motion-safe:animate-pulse" : undefined} />
        </Button>
      </h1>
      <audio
        ref={player}
        src={pronunciation}
        preload="none"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />
    </>
  )
}

export function Profile(props: ProfileProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-2 sm:gap-4">
        <Portrait {...props} />
        <div className="min-w-0 pt-2 sm:pt-3">
          <Name name={props.name} pronunciation={props.pronunciation} />
        </div>
      </CardHeader>
      <CardContent>
        {/* The bio is the same trusted HTML Jekyll rendered in the fallback. */}
        <div className="prose prose-neutral max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: props.bioHtml }} />
      </CardContent>
      <CardFooter>
        <nav className="flex flex-wrap gap-2" aria-label="Contact">
          {props.contacts.map((contact) => (
            <a key={contact.href} href={contact.href} className={buttonVariants({ variant: "outline" })}>
              {contact.label}<ArrowUpRightIcon aria-hidden="true" />
            </a>
          ))}
        </nav>
      </CardFooter>
    </Card>
  )
}
