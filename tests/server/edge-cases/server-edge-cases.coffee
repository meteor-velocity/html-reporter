if process.env.TEST_EDGE_CASES
  describe 'My Samples, with comma', ->
    describe 'Nested 1', ->
      describe 'Nested 1.1', ->
        it 'will fail at runtime', ->
          throw "a big fat runtime exception"

  describe "error in describe block", ->
    # will prevent server from starting
    # throw 'error in describe defniiton'
    # icapod()


    # server will crash 15 seconds after startup
    # setTimeout ->
    #   throw "timeout exception"
    # , 15000

    # server will log error 15 seconds after startup
    # Meteor.setTimeout ->
    #   throw "timeout exception"
    # , 15000

    # the best at really breaking things
    # frequently, but not always, the rest of the server tests fail to load after this
    # it "tries to invoke a metoer api outside of a fiber", (done)->
    #   setTimeout ->
    #     console.log("DOES THIS RUN?")
    #     file = VelocityTestFiles.findOne()
    #     console.log("???")
    #     # done()
    #   , 500

    it "throws an exception outside of a fiber", (done)->
      Meteor.setTimeout ->
        throw "test exception in meteor timeout"
      , 500

    it "trys to access a non-existant variable", ->
      x = {}
      console.log(x.y.z)

    it "calls done repeatedly", (done)->
      done()
      done()
      done()

    it "calls done outside of a fiber", (done)->
      setTimeout ->
        done()

    it "simply fails an assertion", ->
      expect(4).to.equal 5

    it.client "should not run here", ->
      "skip.."
