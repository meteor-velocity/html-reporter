Meteor.startup ->
  # Insert the reporter into the <body>.
  unless UIHarness?
    Blaze.render(Template.TestReporter, document.body)
