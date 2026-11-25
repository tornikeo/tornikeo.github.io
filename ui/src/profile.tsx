import { ArrowUpRightIcon, Volume2Icon } from "lucide-react"
import { cn } from "cn"

import { Avatar } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export type SiteLink = { label: string; href: string; current?: "page" | "location" }
type ProfileProps = {
  name: string
  avatar: string
  firstPhoto: string
  caption: string
  date?: string
  dateLabel?: string
  pronunciation?: string
  bioHtml: string
  contacts: SiteLink[]
}

function Portrait({ name, avatar, firstPhoto, caption, date, dateLabel }: ProfileProps) {
  return (
    <figure className="shrink-0">
      <a
        href={firstPhoto}
        aria-label={`View profile photos of ${name}`}
        aria-haspopup="dialog"
        className="inline-flex align-top rounded-full focus-visible:outline-2"
        data-open-gallery
      >
        <Avatar className="size-16">
          <img src={avatar} width={64} height={64} alt="" className="size-full rounded-full object-cover object-[center_64%]" />
        </Avatar>
      </a>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        {caption}{date && dateLabel && <time className="block" dateTime={date}>{dateLabel}</time>}
      </figcaption>
    </figure>
  )
}

function Name({ name, pronunciation }: Pick<ProfileProps, "name" | "pronunciation">) {
  if (!pronunciation) return <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>

  return (
    <>
      <h1>
        <Button
          variant="ghost"
          className="group/name h-auto justify-start px-2 py-1 text-left text-2xl font-semibold tracking-tight whitespace-normal sm:text-3xl"
          data-play-name
          aria-label={`${name}: play pronunciation`}
        >
          {name}
          <Volume2Icon className="motion-safe:group-data-playing/name:animate-pulse" aria-hidden="true" />
        </Button>
      </h1>
      <audio src={pronunciation} preload="none" />
      <p hidden data-audio-error role="status" className="text-sm">
        Playback failed. <a className="underline" href={pronunciation}>Open the recording</a>
      </p>
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
        {/* Only HTML produced by Jekyll at build time is inserted here. */}
        <div className="prose prose-neutral max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: props.bioHtml }} />
      </CardContent>
      <CardFooter>
        <nav className="flex flex-wrap gap-2" aria-label="Contact">
          {props.contacts.map((contact) => (
            <a key={contact.href} href={contact.href} className={cn(buttonVariants({ variant: "outline" }))}>
              {contact.label}<ArrowUpRightIcon aria-hidden="true" />
            </a>
          ))}
        </nav>
      </CardFooter>
    </Card>
  )
}
