Meteor.startup ->
  # Insert the reporter into the <body>.
  unless UIHarness?
    Ctrl.defs['tr-reporter'].insert($('body'))
