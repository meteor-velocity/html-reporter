Ctrl.define
  'tr-reporter':
    destroyed: -> @controller.dispose()
    ready: ->
      # Expose references to child Ctrls on the API.
      @ctrl.header = @children.header
      @ctrl.results = @children.results
      @controller = PKG.TestReporterController().init(@ctrl)

      # Handle locking the header to the top on scroll.
      do =>
          el = $(document)
          onScroll = =>
              @helpers.isHeaderFixed(el.scrollTop() > 220)
          onScroll = onScroll.throttle(50)
          el.scroll (e) -> onScroll()
          onScroll()

      # Sync empty list icon visibility.
      updateEmptyListState = =>
            resultCtrls = @ctrl.results
            isComplete = @api.isComplete()
            filter = @ctrl.header.selectedTabId()
            isEmpty = resultCtrls.count() is 0
            if @api.isComplete()
              resultCtrls.isEmptySuccessVisible(filter is 'failed' and isEmpty)
              resultCtrls.isEmptyFailureVisible(filter is 'passed' and isEmpty)
              resultCtrls.isEmptySkippedVisible(filter is 'skipped' and isEmpty)
            else
              resultCtrls.isEmptySuccessVisible(false)
              resultCtrls.isEmptyFailureVisible(false)
              resultCtrls.isEmptySkippedVisible(false)

        updateEmptyListState = updateEmptyListState.debounce(100)

      @autorun =>
          resultCtrls = @ctrl.results
          @ctrl.header.selectedTabId()  # Hook into reactive callback.
          @api.isComplete()             # Hook into reactive callback.
          resultCtrls.count()            # Hook into reactive callback.
          updateEmptyListState()



    api:
      isComplete: (value) -> @ctrl.header?.percentComplete() is 1


    helpers:
      isHeaderFixed: (value) -> @prop 'isHeaderFixed', value, default:false
      cssClass: ->
        isComplete = @api.isComplete()
        css = ''
        css += 'tr-header-fixed' if @helpers.isHeaderFixed()
        css += ' tr-running' if not isComplete
        css += ' tr-complete' if isComplete
        css
