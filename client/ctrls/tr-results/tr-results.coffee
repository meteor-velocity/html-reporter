Ctrl.define
  'tr-results':
    ready: ->
      @autorun =>
          isVisible = true
          isVisible = false if @api.isEmptySuccessVisible()
          isVisible = false if @api.isEmptyFailureVisible()
          @el('.tr-results-list').toggle(isVisible)




    api:
      ###
      REACTIVE Gets the total number of result items that have been added.
      ###
      count: (value) -> @prop 'count', value, default:0


      ###
      REACTIVE Gets or sets whether the icon shown when the list
      is empty, but the test run was successful, is visible.
      ###
      isEmptySuccessVisible: (value) -> @prop 'isEmptySuccessVisible', value, default:false


      ###
      REACTIVE Gets or sets whether the icon shown when the list
      is empty, and there were failures.
      ###
      isEmptyFailureVisible: (value) -> @prop 'isEmptyFailureVisible', value, default:false


      isEmptySkippedVisible: (value) -> @prop 'isEmptySkippedVisible', value, default: false

      ###
      Adds a new test result.
      @param spec: The mongo documents containing the test result.
      @param callback: Invoked upon completion.
      ###
      add: (doc, callback) ->
        spec = PKG.Spec().init(doc)

        insertSuite = (suite, callback) =>
              # Create a queue for callbacks.
              # This is to ensure that suite-ctrls are not inserted multiple
              # times while the first suite Ctrl is loading.
              suite.insertCallbacks ?= []
              suite.insertCallbacks.push(callback)
              done = (ctrl) =>
                  suite.insertCallbacks.each (func) -> func(suite.ctrl)
                  suite.insertCallbacks = []

              return if suite?.isLoading
              return done() if not suite?
              return done() if suite.ctrl? and not suite.isLoading
              suite.isLoading = true

              appendCtrl = (suiteCtrl) =>
                  el = if suiteCtrl? then suiteCtrl.elSuites() else @el('> .tr-results-list')
                  suite.ctrl = ctrl = @appendCtrl('tr-result-suite', el, data:suite)
                  ctrl.onReady =>
                      suite.isLoading = false
                      done()

              if parentSuite = suite.parentSuite
                # Recursively insert all parent suites.
                insertSuite suite.parentSuite, (suiteCtrl) => appendCtrl(suiteCtrl)
              else
                appendCtrl()

        # Ensure the contianing suite elements are inserted
        # then render the spec.
        insertSuite spec.parentSuite, (suiteCtrl) =>
            suiteCtrl.addSpec(spec)
            @api.count(@api.count() + 1)
            callback?()



      ###
      Clears the test results.
      ###
      clear: ->
        suiteCtrl.dispose() for suiteCtrl in @findChildren('tr-result-suite')
        @api.count(0)
