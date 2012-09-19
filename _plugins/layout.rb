module Jekyll

  class Layout
    def initialize(site, base, name)
      @site = site
      @base = base
      @name = name

      self.data = {}

      self.process(name)
      self.read_yaml(base, name)

      @mtime = File.mtime(File.join(base, name))
    end

    def mtime
      if layout = self.data["layout"]
        base_mtime = @site.layouts[layout].mtime()
        (base_mtime <=> mtime) == -1 ? @mtime : base_mtime
      else
        @mtime
      end
    end

  end

end

