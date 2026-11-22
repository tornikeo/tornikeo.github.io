import { useRef, useState } from "react"
import { ArrowUpRightIcon, Volume2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export type SiteLink = { label: string; href: string; current?: "page" | "location" }

type ProfileProps = {
  name: string
  avatar: string
  portrait: string
  caption: string
  date: string
  dateLabel: string
  pronunciation?: string
  bioHtml: string
  contacts: SiteLink[]
}

function Portrait({ name, avatar, portrait, caption, date, dateLabel }: ProfileProps) {
  const [fullSize, setFullSize] = useState(false)

  return (
    <figure className="shrink-0">
      <Dialog onOpenChange={(open) => { if (!open) setFullSize(false) }}>
        <DialogTrigger aria-label={`Enlarge portrait of ${name}`} className="rounded-full focus-visible:outline-2">
          <Avatar className="size-16">
            <AvatarImage src={avatar} alt="" className="object-[center_64%]" />
            <AvatarFallback>TO</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Portrait of {name}</DialogTitle>
            <DialogDescription>{caption}, Switzerland · <time dateTime={date}>{dateLabel}</time></DialogDescription>
          </DialogHeader>
          <div className="max-h-[65dvh] overflow-auto rounded-md">
            <img
              src={portrait}
              width={768}
              height={1024}
              alt="Tornike smiling near Lake Lugano"
              className={fullSize ? "max-w-none" : "mx-auto h-auto max-h-[65dvh] w-auto max-w-full object-contain"}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" aria-pressed={fullSize} onClick={() => setFullSize(!fullSize)}>
              Actual size
            </Button>
          </DialogFooter>
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
          onPointerEnter={(event) => { if (event.pointerType === "mouse") play() }}
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
            <Button key={contact.href} variant="outline" render={<a href={contact.href} />}>
              {contact.label}<ArrowUpRightIcon aria-hidden="true" />
            </Button>
          ))}
        </nav>
      </CardFooter>
    </Card>
  )
}
