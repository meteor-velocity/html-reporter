Ctrl.define
  'tr-header-tab':
    init: ->
    ready: ->
    destroyed: ->
    model: ->
    api:
      label: (value) -> @prop 'label', value, default:'Untitled'

    helpers: {}
    events:
      'click': -> @parent.api.selectedTabId(@id)
