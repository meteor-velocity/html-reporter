suiteHasFailed = function (suite)  {
  return !! VelocityTestReports.findOne({
    framework: suite.framework,
    ancestors: suite.ancestors,
    result: "failed"
  });
};

Template.velocity.helpers({
  testReports: function () {
    return VelocityTestReports.find();
  },
  frameworks: function () {
    return VelocityAggregateReports.find({name: {$nin: ["aggregateResult", "aggregateComplete"]}});
  }
});

Template.velocityReports.helpers({
  frameworkStatus: function () {
    var frameworkExecStatus = VelocityAggregateReports.findOne({name: this.name});
    var isComplete = (frameworkExecStatus.result === "completed");
    var hasFailed = !! VelocityTestReports.findOne({framework: this.name, result: "failed"});
    if (hasFailed)
      return "failed";
    else if (isComplete)
      return "passed";
    else
      return "pending";
  },
  suites: function () {
    var result =  [];
    var reports = VelocityTestReports.find({framework: this.name}).fetch();
    // XXX for now, ancestors get reduced to a single-tier suite
    // Should we do fancier indenting, etc. for nested suites?
    // If not, forcing packages to concatenate their own "suite" string
    // instead of ancestors array would clean this up.
    if (reports.length > 0) {

      var reports = _.map(reports, function (report) {
        //must clone report.ancestors to not mutate report.ancestors with .reverse()
        var ancestors = _.clone(report.ancestors);
        report.suite = ancestors.reverse().join(".");
        return report;
      });

      _.each(reports, function (report) {
        if (! _.findWhere(result, {suite: report.suite}))
          result.push({
            framework: report.framework,
            ancestors: report.ancestors, //needed for future queries
            suite: report.suite
          })
      });

      return result;
    }
  },
  suiteStatus: function () {
    return suiteHasFailed(this) ? 'failed' : 'passed';
  },
  suiteNotHidden: function () {
    if (reamplify.store('hideSuccessful'))
      return suiteHasFailed(this);
    return true
  },
  reports: function () {
    console.log( VelocityTestReports.find({
      framework: this.framework,
      ancestors: this.ancestors
    }).fetch(), this.ancestors);
    return VelocityTestReports.find({
      framework: this.framework,
      ancestors: this.ancestors
    });
  }
})

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
      return (! reamplify.store('hideSuccessful'));
    }
  },
  failed: function () {
    return (this.result === "failed");
  }
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
  var isChecked = reamplify.store('hideSuccessful');
  if (isChecked === undefined) {
    //default to true if not saved in reamplify
    isChecked = true;
    reamplify.store('hideSuccessful', isChecked);
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
    var targetId = ev.target.id
    reamplify.store(ev.target.id, ev.target.checked);
  }
});