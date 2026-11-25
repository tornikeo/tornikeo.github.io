import { renderToStaticMarkup } from "react-dom/server"
import { ChevronDownIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "cn"
export function renderSiteContent(document: Document) {
  for (const article of document.querySelectorAll("[data-resource-card]")) {
    // Preserve the HTML Jekyll rendered from project and bibliography sources.
    const title = article.querySelector("[data-resource-title]")?.innerHTML ?? ""
    const description = article.querySelector("[data-resource-description]")?.innerHTML.trim()
    const media = article.querySelector("[data-resource-media]")?.innerHTML
    const figure = article.querySelector("[data-resource-figure]")?.outerHTML
    const links = Array.from(article.querySelectorAll<HTMLAnchorElement>("[data-resource-links] a"))
    const details = Array.from(article.querySelectorAll("[data-resource-details]"), (detail) => ({
      label: detail.querySelector("summary")?.textContent ?? "",
      html: detail.querySelector("[data-details-content]")?.innerHTML ?? "",
    }))

    article.innerHTML = renderToStaticMarkup(
      <Card className={media ? "h-full pt-0" : "h-full"}>
        {media && <div dangerouslySetInnerHTML={{ __html: media }} />}
        <CardHeader>
          {figure && <CardAction className="ml-2" dangerouslySetInnerHTML={{ __html: figure }} />}
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
}
