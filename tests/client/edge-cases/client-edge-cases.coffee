# describe 'My Samples, with comma', ->
#   describe 'Nested 1', ->
#     describe 'Nested 1.1', ->
#       it 'will fail at runtime', ->
#         throw "a big fat runtime exception"
#
#
# describe "error in describe block", ->
#   # throw 'error in describe defniiton'
#
#   it "finishes too late", (done)->
#     Meteor.setTimeout ->
#       done()
#     , 5000
#
#   it "calls done repeatedly", (done)->
#     done()
#     done()
#     done()
#
#   it "finishes with an error passed to done callback", (done)->
#     done("this callback is not happy")
