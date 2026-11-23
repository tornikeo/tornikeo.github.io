import { renderToStaticMarkup } from "react-dom/server"
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "cn"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"

export function renderSiteContent(document: Document) {
  for (const article of document.querySelectorAll("[data-resource-card]")) {
    // Preserve the HTML Jekyll rendered from project and bibliography sources.
    const title = article.querySelector("[data-resource-title]")?.innerHTML ?? ""
    const description = article.querySelector("[data-resource-description]")?.innerHTML.trim()
    const media = article.querySelector("[data-resource-media]")?.innerHTML
    const links = Array.from(article.querySelectorAll<HTMLAnchorElement>("[data-resource-links] a"))
    const details = Array.from(article.querySelectorAll("[data-resource-details]"), (detail) => ({
      label: detail.querySelector("summary")?.textContent ?? "",
      html: detail.querySelector("[data-details-content]")?.innerHTML ?? "",
    }))

    article.innerHTML = renderToStaticMarkup(
      <Card className={media ? "h-full pt-0" : "h-full"}>
        {media && <div dangerouslySetInnerHTML={{ __html: media }} />}
        <CardHeader>
          <CardTitle>
            <h3 className="[&_a:hover]:underline [&_a]:underline-offset-4" dangerouslySetInnerHTML={{ __html: title }} />
          </CardTitle>
          {description && <CardDescription className="space-y-1 [&_a]:underline" dangerouslySetInnerHTML={{ __html: description }} />}
        </CardHeader>
        {details.length > 0 && (
          <CardContent className="space-y-1">
            {details.map(({ label, html }) => (
              <details key={label} className="group/disclosure">
                <summary className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}>
                  {label}<ChevronDownIcon className="group-open/disclosure:rotate-180" aria-hidden="true" />
                </summary>
                <div className="prose prose-neutral mt-2 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
              </details>
            ))}
          </CardContent>
        )}
        {links.length > 0 && (
          <CardFooter className="mt-auto flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.textContent}
                href={link.getAttribute("href") ?? ""}
                target={link.target || undefined}
                rel={link.rel || undefined}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                {link.textContent}
              </a>
            ))}
          </CardFooter>
        )}
      </Card>,
    )
  }

  for (const list of document.querySelectorAll("[data-blog-list]")) {
    const posts = Array.from(list.querySelectorAll("[data-blog-entry]"), (entry) => ({
      href: entry.querySelector("a")?.getAttribute("href") ?? "",
      title: entry.querySelector("[data-blog-title]")?.textContent,
      description: entry.querySelector("[data-blog-description]")?.textContent,
      date: entry.querySelector("time")?.textContent,
      dateTime: entry.querySelector("time")?.dateTime,
    }))

    list.innerHTML = renderToStaticMarkup(posts.map((post) => (
      <li key={post.href}>
        <Item variant="outline" render={<a href={post.href} />}>
          <ItemContent className="min-w-0">
            <time className="text-xs text-muted-foreground" dateTime={post.dateTime}>{post.date}</time>
            <ItemTitle className="block line-clamp-none">{post.title}</ItemTitle>
            {post.description && <ItemDescription className="line-clamp-none">{post.description}</ItemDescription>}
          </ItemContent>
          <ItemActions><ArrowUpRightIcon className="size-4 text-muted-foreground" aria-hidden="true" /></ItemActions>
        </Item>
      </li>
    )))
  }

  for (const container of document.querySelectorAll("[data-blog-pagination]")) {
    const links = Array.from(container.querySelectorAll("a, [aria-current=page]"), (link) => ({
      href: link.getAttribute("href") ?? container.getAttribute("data-current-url") ?? "",
      rel: link.getAttribute("rel"),
      label: link.textContent.trim(),
      current: link.hasAttribute("aria-current"),
    }))

    container.innerHTML = renderToStaticMarkup(
      <Pagination aria-label="Blog pages">
        <PaginationContent className="flex-wrap justify-center">
          {links.map((link) => (
            <PaginationItem key={link.label}>
              {link.rel === "prev" ? <PaginationPrevious href={link.href} rel="prev" text="Newer" />
                : link.rel === "next" ? <PaginationNext href={link.href} rel="next" text="Older" />
                : <PaginationLink href={link.href} isActive={link.current} aria-label={`Page ${link.label}`}>{link.label}</PaginationLink>}
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>,
    )
  }
}
