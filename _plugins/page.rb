module Jekyll

  class Page

    def render(layouts, site_payload)
      @skip = modified?(layouts)

      unless @skip
        payload = {
          "page" => self.to_liquid
        }.deep_merge(site_payload)

        do_layout(payload, layouts)
      end
    end

    def write(dest)
      unless @skip
        path = destination(dest)
        FileUtils.mkdir_p(File.dirname(path))
        File.open(path, 'w') do |f|
          f.write(self.output)
        end
      end
    end

    def modified?(layouts)
      mtime_src = File.mtime(File.join(@base, @dir, @name))
      dest = File.join(@site.dest, @dir, @name)
      if File.exists?(dest)
        mtime_dest = File.mtime(File.join(@site.dest, @dir, @name))

        (mtime_src <=> mtime_dest) == -1 and
          (layouts[self.data["layout"]].mtime() <=> mtime_dest) == -1
      else
        false
      end
    end

  end

end