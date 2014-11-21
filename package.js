Package.describe({
  name: "velocity:html-reporter",
  summary: "Reactive Velocity test reports in your app.",
  version: "0.3.0",
  git: "https://github.com/rdickert/velocity-html-reporter.git",
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.0");
  api.use('velocity:core@0.3.0', 'client');

  api.use(['underscore', 'templating','amplify@1.0.0', 'less'], 'client');

  api.addFiles('lib/reamplify.js', 'client');

  api.addFiles('lib/velocity.js', 'client');
  api.addFiles('lib/client-report.html', 'client');
  api.addFiles('lib/client-report.js', 'client');
  api.addFiles('lib/client-report.less', 'client');
  api.addFiles('lib/status-widget.less', 'client');

  api.addFiles('lib/velocity_logo.svg');
  api.addFiles('lib/velocity_cog.svg');
  api.addFiles('lib/icon-time.png');

  // api.export('reamplify', ['client']);
});
