suiteHasFailed = function (suite)  {
  return !! VelocityTestReports.findOne({
    framework: suite.framework,
    ancestors: suite.ancestors,
    result: "failed"
  });
};

frameworkStatus = function (name) {
  var frameworkExecStatus = VelocityAggregateReports.findOne({name: name});
  var isComplete = (frameworkExecStatus && frameworkExecStatus.result === "completed");
  var hasFailed = !! VelocityTestReports.findOne({framework: name, result: "failed"});
  if (hasFailed)
    return "failed";
  else if (isComplete)
    return "passed";
  else
    return "pending";
}

function mochaPresent() {
  //XXX hard-coding mocha iframe support for now
  return !! VelocityAggregateReports.findOne({'name': 'mocha'});
}
function nightwatchPresent() {
  return !! VelocityAggregateReports.findOne({'name': 'nightwatch'});
}



Template.velocity.helpers({
  resetting: function () {
    return Session.get('resettingVelocity')
  },
  testReports: function () {
    return VelocityTestReports.find();
  },
  frameworks: function () {
    return VelocityAggregateReports.find({name: {$nin: ["aggregateResult", "aggregateComplete"]}});
  },
  active: function (id) {
    return reamplify.store(id);
  },
  mochaPresent: mochaPresent,
  nightwatchPresent: nightwatchPresent
});

Template.velocityReports.helpers({
  frameworkStatus: function () {
    return frameworkStatus(this.name)
  },
  frameworkTotalTestCount: function () {
    return VelocityTestReports.find({framework: this.name}).count();
  },
  frameworkPassedTestCount: function () {
    return VelocityTestReports.find({framework: this.name, result: 'passed'}).count();
  },
  noFrameworkFiles: function () {
    // XXX presence of VelocityAggregateReports is a stand-in for
    // Velocity being loaded. This is a bit brittle. It breaks
    // if you call the Velocity "reset" method.
    var velocityIsLoaded = !! VelocityAggregateReports;
    return  ! velocityIsLoaded ?  false : ! VelocityTestFiles.findOne({targetFramework: this.name});
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
    if (!reamplify.store('showSuccessful'))
      return suiteHasFailed(this);
    return true
  },
  reports: function () {
    return VelocityTestReports.find({
      framework: this.framework,
      ancestors: this.ancestors
    });
  }
})

Template.velocityControlPanel.helpers({
  anyFailed: function () {
    var aggregateResult = VelocityAggregateReports.findOne({name: 'aggregateResult'})
    if (aggregateResult && aggregateResult.result === 'failed') {
      return  true;
    }
    return false;
  },
  aggregateResult: function () {
    return VelocityAggregateReports.findOne({name: 'aggregateResult'});
  },
  aggregateReports: function () {
    return VelocityAggregateReports.find();
  },
  totalPassedTestCount: function () {
    return VelocityTestReports.find({result: 'passed'}).count();
  },
  totalFailedTestCount: function () {
    return VelocityTestReports.find({result: 'failed'}).count();
  },
  totalTestCount: function () {
    return VelocityTestReports.find().count();
  },
  frameworks: function () {
    return VelocityAggregateReports.find({name: {$nin: ["aggregateResult", "aggregateComplete"]}});
  },
  frameworkStatus: function () {
    return {result: frameworkStatus(this.name)};
  },
  frameworkFailedCount: function () {
    return VelocityTestReports.find({framework: this.name, result: "failed"}).count();
  },
  mochaPresent: mochaPresent,
  nightwatchPresent: nightwatchPresent,
  showActive: function (id) {
    // XXX refactor this to name consistently
    return !reamplify.store(id) ? '' : 'active';
  },
  showActive: function (self) {
    // $self = $("#"+ self);
    return reamplify.store(self) ? 'active' : ''
  }
});
Template.velocityControlPanel.events({
  'click #runNightwatchTests': function () {
    console.log('#runNightwatchTests clicked.');
  },
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
      return (reamplify.store('showSuccessful'));
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
  if (aggregateComplete && aggregateResult
      && aggregateResult.result === 'passed' && aggregateComplete.result === 'completed') {
    return 'passed';
  }
  return 'pending';
};

Template.velocity.overlayIsVisible = function () {
  return amplify.store('velocityOverlayIsVisible') ? 'block' : 'none';
};

Template.velocityTestFiles.isVisible = function () {
  return amplify.store('velocityTestFilesIsVisible') ? 'block' : 'none';
};
Template.velocityLogs.isVisible = function () {
  return amplify.store('velocityLogsIsVisible') ? 'block' : 'none';
};

Template.velocity.events({
  'click .display-toggle': function (e) {
    var targetId = $(e.target).data('target'),
        $target = $('#' + targetId);
    $target.toggleClass('visible');
    amplify.store(targetId + 'IsVisible', $target.is(':visible'));
  },
  'change input:checkbox': function (e) {
    var targetId = e.target.id
    reamplify.store(e.target.id, e.target.checked);
  },
  'click button.control-toggle': function (e) {
    var $target = $('#' + e.target.id);
    $target.toggleClass('active');
    reamplify.store(e.target.id, $target.hasClass('active'));
  }
});

Template.velocityReports.events({
  'click .copy-sample-tests': function (e) {
    Meteor.call('copySampleTests', {framework: this.name}, function (err, res) {
      // XXX This method for getting the new files to register is slow, but it
      // works. The reset method gets Velocity to see the new files.
      // We then disconnect altogether to prevent flapping of reactive
      // template elements (& overlay a notification to show the user
      // what's happening). Then we simply reload. Is there a way to do this
      // with a lighter touch?

      // make sure the user can see the demo tests, which generally pass.
      reamplify.store('showSuccessful', true);
      Session.set('resettingVelocity', true)
      Meteor.call('reset');
      Meteor.disconnect();
      location.reload();
    });
  }
});
