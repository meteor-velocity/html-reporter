localStorageSelectedTabId = (value) -> LocalStorage.prop 'tr-header:selectedTabId', value, default:'total'



Ctrl.define
  'tr-header':
    init: ->
      # Retrieve initial selected tab ID from local storage.
      @api.selectedTabId(localStorageSelectedTabId())


    ready: ->
      # Sync tab labels.
      @autorun =>
          format = (number) ->
            return '-' if Object.isNaN(number)
            number

          total = @api.totalTests()
          @children.total.label("#{ format(total) } #{ Util.string.plural(total, 'test') }")
          @children.passed.label("#{ format(@api.totalPassed()) } Passed")
          @children.failed.label("#{ format(@api.totalFailed()) } Failed")
          @children.skipped.label("#{ format(@api.totalSkipped()) } Skipped")

      # Store selected tab ID in local storage.
      @autorun => localStorageSelectedTabId(@api.selectedTabId())

      # Sync tab position.
      @autorun =>
          selectedId = @api.selectedTabId()
          tabCtrl = @children[selectedId]
          if tabCtrl
            left = tabCtrl.el().position().left
            left = Math.floor(left)
            @el('.tr-selection').css('transform', "translateX(#{ left }px)")

      # Avoid sliding animation on first load.
      Util.delay => @el().addClass('tr-loaded')



    api:
      ###
      REACTIVE: Gets or sets the propgress percentage (0..1)
      ###
      percentComplete: (value) -> @prop 'progress', value, default:0

      ###
      REACTIVE: Gets or sets the title of the test.
      ###
      title: (value) -> @prop 'title', value


      ###
      REACTIVE: Gets or sets the ID of the currently selected tab.
      ###
      selectedTabId: (value) -> @prop 'selectedTabId', value, default:'total'


      ###
      REACTIVE: Gets or sets the number of seconds the tests took to execute.
      ###
      elapsedSeconds: (value) -> @prop 'elapsedSeconds', value, default:null



      # Totals
      totalTests: (value) -> @prop 'totalTests', value, default:0
      totalPassed: (value) -> @prop 'totalPassed', value, default:0
      totalFailed: (value) -> @prop 'totalFailed', value, default:0
      totalSkipped: (value) -> @prop 'totalSkipped', value, default:0





    helpers:
      cssClass: ->
        css = ''
        css += 'tr-has-failures' if @api.totalFailed() > 0
        css


      title: ->
        title = @api.title()
        right = null
        if Util.isBlank(title)
          main = 'Untitled'
        else
          parts = title.split(':')
          if parts.length is 1
            main = parts[0]
          else
            main = parts[1]
            right = title
        result =
          main: main
          right: right


      progressStyle: ->
        percent = @api.percentComplete()
        percent = Number.range(0,1).clamp(percent)
        style = "width:#{ percent * 100 }%;"
        style

      elapsed: ->
        if seconds = @api.elapsedSeconds()
          result =
            time: seconds
            unit: Util.string.plural(seconds, 'second')

      percent: ->
        percent = @api.percentComplete()
        percent = 0 if Object.isNaN(percent)
        (percent * 100).round()
