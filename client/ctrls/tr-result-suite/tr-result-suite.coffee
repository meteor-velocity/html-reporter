SELECTOR_SPECS = '> .tr-content > .tr-specs'
SELECTOR_SUITES = '> .tr-content > .tr-suites'


Ctrl.define
  'tr-result-suite':
    init: ->
      @specs = {}
      @suite = @data

    ready: ->
      @autorun =>
          @el(SELECTOR_SPECS).toggle(@api.totalSpecs() > 0)


    destroyed: -> delete @suite.ctrl


    api:
      ###
      Determines if this is the root suite in the hierarchy.
      ###
      isRoot: -> not @suite.parentSuite?


      ###
      REACTIVE: Gets the total number of specs that have been added to the suite.
      ###
      totalSpecs: (value) -> @prop 'totalSpecs', value, default:0


      ###
      Retrieves the element that contains the child suites.
      ###
      elSuites: -> @el(SELECTOR_SUITES)


      ###
      Adds a new test result to the suite.
      @param spec: The test result model.
      ###
      addSpec: (spec) ->
        # Setup initial conditions.
        def = @specs[spec.id] ?= {}
        def.client = spec if spec.isClient
        def.server = spec if spec.isServer
        @api.totalSpecs(@api.totalSpecs() + 1)
        return if def.isLoading

        # Pass spec data to the Ctrl.
        onReady = (ctrl) =>
            def.ctrl = ctrl
            ctrl.clientResult(def.client) if def.client?
            ctrl.serverResult(def.server) if def.server?

        # Load the Ctrl into the DOM if it does not already exist.
        if ctrl = def.ctrl
          onReady(ctrl)

        if not def.ctrl?
          def.isLoading = true
          ctrl = @appendCtrl 'tr-result-spec', @el(SELECTOR_SPECS)
          ctrl.onReady =>
              onReady(ctrl)
              def.isLoading = false



    helpers:
      cssClass: ->
        css = ''
        css += 'tr-root' if @api.isRoot()
        css


