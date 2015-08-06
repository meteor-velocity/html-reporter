###
Represents the results of a single test.
###
PKG.Spec = stampit().enclose ->
  doc = null


  # ----------------------------------------------------------------------


  ###
  Initializes the spec with the Velocity result document.
  @param document: The Velocity document.
  ###
  @init = (document) ->
    # Setup initial conditions.
    doc = document
    ancestors = doc.ancestors
    @name = doc.name
    @parentSuite = PKG.Suite.findOrCreate(ancestors)
    throw new Error('Must have a parent suite') unless @parentSuite

    # Store the ID
    # NOTE: This will be the same for the Spec on the client and server.
    @id = ''
    @id += "#{ @parentSuite.id }:" if @parentSuite.id
    @id += Util.hash(@name)

    # Store state.
    @isServer = doc.isServer
    @isClient = doc.isClient
    @duration = doc.duration

    # Store the UID (Unqiue)
    # NOTE: This is unique for the client or server.
    @executionDomain = if @isServer then 'server' else 'client'
    @uid = "#{ @id }:#{ @executionDomain }"

    # Add this spec to the parent suite.
    @parentSuite.childSpecs.push(@)
    @parentSuite.childSpecs.total(@parentSuite.childSpecs.total() + 1)

    @passed = doc.result is 'passed'
    @failed = doc.result is 'failed'
    @skipped = doc.result is 'pending'


    if @failed
      @error =
        message: doc.failureMessage
        stackTrace: doc.failureStackTrace
        domain: @executionDomain
        isServer: @isServer
        isClient: @isClient

    # Finish up.
    return @



  # ----------------------------------------------------------------------
  return @
