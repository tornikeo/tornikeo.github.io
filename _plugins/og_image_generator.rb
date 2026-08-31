require "fileutils"
require "open3"

module Tornikeo
  class OgImageGenerator < Jekyll::Generator
    safe true
    priority :low

    IMAGE_DIRECTORY = "/assets/img/og".freeze
    MAX_SNIPPET_LENGTH = 190

    def generate(site)
      site.posts.docs.each do |post|
        image_path = "#{IMAGE_DIRECTORY}/#{post.data.fetch("slug")}.png"
        post.data["og_image"] = absolute_url(site, image_path)
        post.data["og_image_alt"] = "A preview of #{post.data.fetch("title", "this article")}"
        post.data["og_description"] = excerpt_for(post)
      end
    end

    private

    def absolute_url(site, path)
      site_url = site.config.fetch("url", "").to_s.sub(%r{/$}, "")
      baseurl = site.config.fetch("baseurl", "").to_s
      "#{site_url}#{baseurl}#{path}"
    end

    def excerpt_for(post)
      description = clean_text(post.data.fetch("description", ""))
      return truncate(description) if description.length >= 80

      paragraphs = post.content
        .to_s
        .gsub(/```.*?```/m, " ")
        .gsub(/\$\$.*?\$\$/m, " ")
        .split(/\n\s*\n/)

      paragraph = paragraphs
        .map { |candidate| clean_text(candidate) }
        .find { |candidate| candidate.length >= 80 }

      fallback = description.empty? ? site_fallback(post) : description
      truncate(paragraph || fallback)
    end

    def site_fallback(post)
      "Read #{post.data.fetch("title", "this article")} on tornikeo.com."
    end

    def clean_text(value)
      value
        .to_s
        .gsub(/!\[[^\]]*\]\([^)]*\)/, " ")
        .gsub(/\[([^\]]+)\]\([^)]*\)/, "\\1")
        .gsub(/<[^>]+>/, " ")
        .gsub(/^\s{0,3}\#{1,6}\s+/, "")
        .gsub(/^\s*(?:[-*+] |\d+[.)] )/, "")
        .gsub(/[*_`>#~]/, "")
        .gsub(/\s+/, " ")
        .strip
    end

    def truncate(value)
      return value if value.length <= MAX_SNIPPET_LENGTH

      shortened = value[0, MAX_SNIPPET_LENGTH + 1]
      shortened = shortened.rpartition(" ").first
      "#{shortened}…"
    end
  end

  class OgImageRenderer
    WIDTH = 1200
    HEIGHT = 630

    def self.render_all(site)
      output_directory = File.join(site.dest, "assets", "img", "og")
      FileUtils.mkdir_p(output_directory)

      site.posts.docs.each do |post|
        render(post, File.join(output_directory, "#{post.data.fetch("slug")}.png"))
      end
    end

    def self.render(post, output_path)
      title = post.data.fetch("title", "Untitled").to_s
      snippet = post.data.fetch("og_description", "").to_s
      date = post.date.strftime("%B %-d, %Y")
      title_size = title.length > 72 ? 47 : title.length > 48 ? 53 : 60

      command = [
        "convert",
        "-size", "#{WIDTH}x#{HEIGHT}", "xc:#f1efe9",
        "-fill", "#d8d3c8", "-stroke", "none", "-draw", "roundrectangle 72,58 1144,590 30,30",
        "-fill", "#ffffff", "-draw", "roundrectangle 56,42 1128,574 30,30",
        "-fill", "#ff6846", "-draw", "circle 96,92 108,92",
        "-fill", "#171717", "-font", "Arimo-Bold", "-pointsize", "22", "-draw", "text 124,101 'TORNIKEO.COM'",
        "-fill", "#77736c", "-font", "Arimo-Regular", "-pointsize", "19", "-draw", "text 888,100 'AI IN THE WILD'",
        "-fill", "#ddd9d0", "-draw", "rectangle 88,132 1096,134",
        "(",
          "-background", "none", "-fill", "#171717", "-font", "Arimo-Bold",
          "-pointsize", title_size.to_s, "-gravity", "northwest", "-size", "960x166",
          "caption:#{title}",
        ")",
        "-geometry", "+96+164", "-composite",
        "(",
          "-background", "none", "-fill", "#56534d", "-font", "Arimo-Regular",
          "-pointsize", "27", "-gravity", "northwest", "-size", "960x118",
          "caption:#{snippet}",
        ")",
        "-geometry", "+96+344", "-composite",
        "-fill", "#77736c", "-font", "Arimo-Regular", "-pointsize", "20", "-draw", "text 96,526 '#{date}'",
        "-fill", "#171717", "-font", "Arimo-Bold", "-pointsize", "20", "-draw", "text 858,526 'READ THE ARTICLE  →'",
        "-strip", output_path
      ]

      _stdout, stderr, status = Open3.capture3(*command)
      return if status.success?

      raise Jekyll::Errors::FatalException, "Could not generate #{output_path}: #{stderr.strip}"
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  Tornikeo::OgImageRenderer.render_all(site)
end
