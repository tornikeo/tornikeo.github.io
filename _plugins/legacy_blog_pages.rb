# Preserve bookmarks to the six former paginated archive pages.
Jekyll::Hooks.register :site, :post_read do |site|
  (2..7).each do |number|
    page = Jekyll::PageWithoutAFile.new(site, site.source, "blog/page/#{number}", "index.html")
    page.data["layout"] = nil
    page.data["sitemap"] = false
    page.content = '<!doctype html><html lang="en"><meta charset="utf-8"><title>Blogs</title><meta http-equiv="refresh" content="0;url=../../"><link rel="canonical" href="../../"><a href="../../">All posts</a></html>'
    site.pages << page
  end
end
