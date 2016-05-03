Package.describe({
  name: 'velocity:html-reporter',
  summary: 'Reactive Velocity test reports in your app.',
  version: '0.10.1',
  git: 'https://github.com/meteor-velocity/html-reporter.git',
  testOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('velocity:reports@1.0.0', 'client');

  api.use([
    'underscore',
    'templating',
    'amplify@1.0.0',
    'less',
    'jquery',
    'session',
    'tracker'
  ], 'client');

  api.addFiles('lib/reamplify.js', 'client');

  api.addFiles('lib/velocity.js', 'client');
  api.addFiles('lib/client-report.html', 'client');
  api.addFiles('lib/client-report.js', 'client');
  api.addFiles('lib/velocity.import.less', 'client');
  api.addFiles('lib/client-report.less', 'client');
  api.addFiles('lib/status-widget.less', 'client');

  api.addAssets('lib/velocity-logo.png', 'client');
  api.addAssets('lib/velocity_cog.svg', 'client');
  api.addAssets('lib/icon-time.png', 'client');
});
