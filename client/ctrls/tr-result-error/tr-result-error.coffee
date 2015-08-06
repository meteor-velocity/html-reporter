Ctrl.define
  'tr-result-error':
    api:
      isDetailsVisible: (value) -> @prop 'isDetailsVisible', value, default:false


    helpers:
      cssClass: ->
        css = ''
        css += 'details-visible' if @api.isDetailsVisible()
        css

      domain: -> @data.domain
      title: -> @data.message

      detailLabel: -> if @api.isDetailsVisible() then 'Less Detail' else 'More Detail'

      stackTrace: -> @data.stackTrace


    events:
      'click h2': -> @api.isDetailsVisible(not @api.isDetailsVisible())
