Package.describe({
  name: "velocity:html-reporter",
  summary: "Reactive Velocity test reports in your app.",
  version: "0.2.4",
  git: "https://github.com/rdickert/velocity-html-reporter.git",
  debugOnly: true
});

Package.on_use(function(api) {
  if (api.versionsFrom) {
    api.versionsFrom("METEOR@0.9.1");
    api.use('velocity:core@0.2.0', 'client');
  } else {
    api.use('velocity', 'client');
  }

  api.use(['underscore', 'templating','amplify', 'less'], 'client');

  api.add_files('lib/reamplify.js', 'client');

  api.add_files('lib/velocity.js', 'client');
  api.add_files('lib/client-report.html', 'client');
  api.add_files('lib/client-report.js', 'client');
  api.add_files('lib/client-report.less', 'client');
  api.add_files('lib/status-widget.less', 'client');

  api.add_files('lib/spinner.gif');
  api.add_files('lib/velocity_logo.svg');
  api.add_files('lib/velocity_cog.svg');
  api.add_files('lib/icon-time.png');

  // api.export('reamplify', ['client']);
});
