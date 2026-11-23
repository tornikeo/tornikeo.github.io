Jekyll::Hooks.register :site, :post_write do |site|
  renderer = File.join(site.source, "ui", "dist", "prerender", "prerender.js")
  if File.file?(renderer)
    Jekyll.logger.info "shadcn:", "Rendering static components"
    unless system("node", renderer, site.dest)
      raise Jekyll::Errors::FatalException, "Failed to render shadcn components"
    end
  end
end
