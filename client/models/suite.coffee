###
Represents a suite of test results.
###
PKG.Suite = stampit().enclose ->
  hash = new ReactiveHash(onlyOnChange:true)


  # ----------------------------------------------------------------------


  ###
  Initializes the suite.
  @param id:   The unique ID of the suite.
  @param name: The descriptive name of the suite.
  @param ancestors: The array of ancestors if any exist.

  ###
  @init = (id, name, ancestors) ->
    # Store state.
    @id = id
    @name = name
    @parentSuite = PKG.Suite.findOrCreate(ancestors)

    # Add this suite to the parent's child collection.
    if @parentSuite
      @parentSuite.childSuites.push(@)
      @parentSuite.childSuites.total(@parentSuite.childSuites.total() + 1)

    # Finish up.
    return @


  @childSpecs = []
  @childSuites = []

  @childSpecs.total = (value) -> hash.prop 'totalSpecs', value, default:0
  @childSuites.total = (value) -> hash.prop 'totalSuites', value, default:0


  # ----------------------------------------------------------------------
  return @





###
Finds or creates the suite from the given test ancestors.
@param ancestors: The Spec's ancestors array.
###
PKG.Suite.findOrCreate = (ancestors) ->
  # Return the root suite if the suite does not exist.
  id = getSuiteId(ancestors)
  return PKG.rootSuite unless id?

  # Check if the suite has already been created.
  return PKG.suites[id] if PKG.suites[id]?

  # Create the new suite.
  ancestors = Object.clone(ancestors)
  name = ancestors[0]
  ancestors = ancestors.removeAt(0)
  PKG.suites[id] = suite = PKG.Suite().init(id, name, ancestors)

  # Finish up.
  suite




getSuiteId = (ancestors) ->
  return if Util.isBlank(ancestors)
  id = ancestors.join(':')
  Util.hash(id)



###
The base suite that all suites/specs descend from.
###
PKG.rootSuite = PKG.Suite().init(null, 'root')
