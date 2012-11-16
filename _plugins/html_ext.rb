module Jekyll

  module HtmlExtensions

    def handle_links(content)
      base = @dir.sub(/^(\/.+?)\/.*/, '\1') + '/'
      content.gsub(/<.*?>/) {|m| m.gsub(/ (href|src)="!/, " \\1=\"#{base}")}
    end

    def output_file(dest, content)
      FileUtils.mkdir_p(File.dirname(dest))
      File.open(dest, 'w') do |f|
        f.write(content)
      end
    end

    def output_html(dest, content)
      path = self.destination(dest)
      content = handle_links(content)
      self.output_file(path, content)
    end

  end

  class Page
    include HtmlExtensions

    # Hook jekyll
    def write(dest)
      self.output_html(dest, self.output)
    end
  end

end
