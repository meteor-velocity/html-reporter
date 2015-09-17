Package.describe({
  name: 'velocity:html-reporter',
  summary: 'Reactive Velocity test reports in your app.',
  version: '0.9.0-rc.3',
  git: 'https://github.com/meteor-velocity/html-reporter.git',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2-rc.15');
  api.use('ecmascript');
  api.use('velocity:core@0.10.0-rc.4', 'client');

  api.use([
    'underscore',
    'templating',
    'amplify@1.0.0',
    'less',
    'jquery',
    'session'
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
