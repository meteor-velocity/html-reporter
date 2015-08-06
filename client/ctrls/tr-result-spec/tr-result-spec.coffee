Ctrl.define
  'tr-result-spec':
    init: -> @spec = @data

    destroyed: -> delete @spec.ctrl


    api:
      clientResult: (value) -> @prop 'clientResult', value
      serverResult: (value) -> @prop 'serverResult', value

      passed: ->
        client = @api.clientResult()
        server = @api.serverResult()
        return false if client? and not client.passed
        return false if server? and not server.passed
        true


      failed: ->
        client = @api.clientResult()
        server = @api.serverResult()
        return true if client? and client.failed
        return true if server? and server.failed
        false

      skipped: ->
        client = @api.clientResult()
        server = @api.serverResult()
        return true if client? and client.skipped
        return true if server? and server.skipped
        false



    helpers:
      name: ->
        Util.firstValue([@api.clientResult()?.name, @api.serverResult()?.name])


      badge: ->
        client = @api.clientResult()
        server = @api.serverResult()
        result = []
        if client?
          result.push "Client #{ formatElapsed(client.duration) }"
        if server?
          result.push "Server #{ formatElapsed(server.duration) }"
        if result.length is 0 then null else result.join(' | ')


      cssClass: ->
        isClient = @api.clientResult()?
        isServer = @api.serverResult()?
        css = ''
        css += ' tr-client' if isClient
        css += ' tr-server' if isServer
        css += ' tr-client-server' if isClient and isServer
        css



# PRIVATE ----------------------------------------------------------------------


formatElapsed = (msecs) ->
  if msecs?
    if msecs > 500
      time = (msecs / 1000).round(1)
      unit = 's'
    else
      time = msecs
      unit = 'ms'
    "#{ time }#{ unit }"
