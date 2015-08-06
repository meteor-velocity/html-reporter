###
The root controller for the test reporter.
###
TestReporterController = stampit().enclose ->
  ctrl = null
  hash = new ReactiveHash(onlyOnChange:true)


  # METHODS ----------------------------------------------------------------------

  @isComplete = (value) -> hash.prop 'isComplete', value, default:false


  ###
  Initializes the test-reporter.
  @param ctrl: The [test-reporter] UI control.
  ###
  @init = (ctrl) =>
    # Retrieve collections.
    Reports = Package['velocity:core'].VelocityTestReports
    Aggregates = Package['velocity:core'].VelocityAggregateReports

    #TODO
    #there's probably a better way to get the list of packages under test
    packagesUnderTest = []
    for pkg, tmp of Package
      if pkg.indexOf("local-test") == 0
        splitPkg = pkg.split(":")
        packageName = splitPkg[1]
        packageName += ":#{splitPkg[2]}" if splitPkg[2]
        packagesUnderTest.push packageName

    #TODO set list of packages, not the title
    ctrl.header.title(packagesUnderTest[0])

    # Sync progress.
    showElapsedTime = =>
        # FIXME: We need a start time in the aggregate reports
        startedAt = Date.now()
        if startedAt
          seconds = ((Date.now() - startedAt) / 1000).round(1)
        else
          seconds = 0
        ctrl.header.elapsedSeconds(seconds)

        # Loop on a timer if not complete.
        if not @isComplete()
          Util.delay 100, => showElapsedTime()

    showElapsedTime()

    @autorun =>
      isComplete = @isComplete()
      showElapsedTime() if isComplete


    # Display results.
    @autorun =>
        # Calculate stats.
        aggregateCompleted = Aggregates.findOne({name: 'aggregateComplete'})
        aggregateResult = Aggregates.findOne({name: 'aggregateResult'})
        total = Reports.find().count()


        totals = {}
        Reports.find({}, {fields: {result: 1}}).forEach (rep)->
          totals[rep._id] = rep.result

        [passed, failed, skipped] = [0,0,0]
        _.values(totals).forEach (result)->
          passed +=1 if result == "passed"
          failed +=1 if result == "failed"
          skipped +=1 if result == "pending"

        # Calculate complete percentage.
        percentComplete = if total is 0 then 0 else (1.0 * (passed + failed + skipped) / total)
        isComplete = aggregateCompleted?.result == "completed"
        @isComplete(isComplete) # Store in reactive property.

        # Store data attributes.
        if aggregateCompleted
          $(document.body).attr("data-completed", "#{ isComplete }")
        if aggregateResult
          $(document.body).attr("data-result", "#{ aggregateResult.result }")

        # Update header totals.
        ctrl.header.totalPassed(passed)
        ctrl.header.totalFailed(failed)
        ctrl.header.totalSkipped(skipped)
        ctrl.header.totalTests(total)
        ctrl.header.percentComplete(percentComplete)


    # Load results.
    do =>
        addResult = (doc) => ctrl.results.add(doc)

        queue = []
        renderQueue = =>
              docs = Object.clone(queue)
              queue = []
              addResult(doc) for doc in docs
              if not @isComplete()
                Util.delay 500, => renderQueue()
        renderQueue()

        resultsHandle = null
        loadResults = (selector) =>

            isComplete = @isComplete()
            resultsHandle?.stop() if isComplete

            cursor = Reports.find(selector)
            if isComplete
              # The test run is already complete. Load the items manually.
              addResult(doc) for doc in cursor.fetch()

            else
              # Display each new result as it arrives.
              resultsHandle?.stop()
              resultsHandle = cursor.observe
                added: (doc) -> queue.push(doc)


        # Sync the results filter with the selected header tab.
        @autorun =>
            tabId = ctrl.header.selectedTabId()
            selector = {}
            selector.result = tabId unless tabId is 'total'
            if tabId == "skipped"
              selector.result = "pending"
            selector

            ctrl.results.clear()
            Util.delay => loadResults(selector)

    return @ # Make chainable.


  # ----------------------------------------------------------------------
  return @



# Export.
PKG.TestReporterController = stampit.compose(
  Stamps.Disposable
  Stamps.AutoRun
  TestReporterController
)
