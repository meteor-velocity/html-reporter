Template.velocity.helpers({
  glyphiconType: function (result) {
    if (result === "passed" || result === "completed")
      return "glyphicon glyphicon-ok";
    if (result === "failed")
      return "glyphicon glyphicon-remove";
    return "glyphicon glyphicon-time";
  },
  testReports: function () {
    return VelocityTestReports.find();
  },
  labelColor: function (result) {
    if (result === "passed" || result === "completed")
      return "label-success";
    if (result === "failed")
      return "label-warning";
    return "label-danger";
  },

  reportTree: function() {
    var convertObjToArray = function (obj, valueName) {
      valueName = valueName || 'results';
      return _.map(obj, function (item, key) {
        var result = {};
        result.name = key;
        result[valueName] = item;
        return result;
      })
    }

    // compile reports into resultsTree
    var reports = VelocityTestReports.find(),
        resultTree = {};

    reports.forEach(function (result) {
      var framework = result.framework,
          suite = result.ancestors && result.ancestors[0];
      if (! resultTree[framework])
        resultTree[framework] = {}
      if (! resultTree[framework][suite])
        resultTree[framework][suite] = [result]
      else
        resultTree[framework][suite].push(result);
    });

    //convert resultsTree to output arrays for template #each
    resultTree = convertObjToArray(resultTree, "suites");
    _.each(resultTree, function (package){
      package.suites = convertObjToArray(package.suites);
    });
    return resultTree;
  }
});

Template.velocityAggregateReports.helpers({
  aggregateReports: function () {
    return VelocityAggregateReports.find();
  }
})

Template.resultLabel.helpers({
  glyphiconType: function (result) {
    if (result === "passed" || result === "completed")
      return "glyphicon glyphicon-ok";
    if (result === "failed")
      return "glyphicon glyphicon-remove";
    return "glyphicon glyphicon-time";
  },
  labelColor: function (result) {
    if (result === "passed" || result === "completed")
      return "label-success"
    if (result === "failed")
      return "label-danger";
    return "label-default";
  }
});

Template.velocityTestReport.helpers({
  reportNotHidden: function () {
    if (this.result === "failed")
      return true;
    else{
      var hideSuccessful = Session.get('hideSuccessful')
      if (hideSuccessful === undefined) {
        // XXX amply + Session = redundant
        hideSuccessful = amplify.store('hideSuccessful');
        Session.set('hideSuccessful', hideSuccessful);
      }
      return (! hideSuccessful);
    }
  },
  failed: function () {
    return (this.result === "failed");
  },
})

Template.velocityTestFiles.testFiles = function () {
  return VelocityTestFiles.find();
};

Template.velocityLogs.logs = function () {
  return VelocityLogs.find();
};

Template.velocity.statusWidgetClass = function () {
  var aggregateResult = VelocityAggregateReports.findOne({name: 'aggregateResult'})
  if (aggregateResult && aggregateResult.result === 'failed') {
    return  'failed';
  }

  var aggregateComplete = VelocityAggregateReports.findOne({name: 'aggregateComplete'});
  if (aggregateComplete && aggregateResult.result === 'passed' && aggregateComplete.result === 'completed') {
    return 'passed';
  }
  return 'pending';
};

Template.velocity.overlayIsVisible = function () {
  return amplify.store('velocityOverlayIsVisible') ? 'block' : 'none';
};

Template.velocityAggregateReports.hideSuccessfulIsChecked = function (id) {
  var isChecked = amplify.store('hideSuccessful');
  if (isChecked === undefined) {
    //default to true if not saved in amplify
    isChecked = true;
    //XXX Stored in 2 places: amplify for persistence between refreshes, Session for reactivity
    amplify.store('hideSuccessful', isChecked);
    Session.set('hideSuccessful', isChecked);
  }
  return isChecked ? 'checked' : '';
}

Template.velocityTestFiles.isVisible = function () {
  return amplify.store('velocityTestFilesIsVisible') ? 'block' : 'none';
};
Template.velocityLogs.isVisible = function () {
  return amplify.store('velocityLogsIsVisible') ? 'block' : 'none';
};

Template.velocity.events({
  'click .display-toggle': function (ev) {
    var targetId = $(ev.target).data('target'),
        $target = $('#' + targetId);
    $target.toggle();
    amplify.store(targetId + 'IsVisible', $target.is(':visible'));
  },
  'change input:checkbox': function (ev) {
    console.log('checkbox changed to', ev.target.checked)
    var targetId = ev.target.id
    amplify.store(ev.target.id, ev.target.checked);
    Session.set('hideSuccessful', ev.target.checked);
  }
});