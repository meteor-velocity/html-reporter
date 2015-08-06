Package.describe({
  name: 'velocity:html-reporter',
  summary: 'Reactive Velocity test reports in your app.',
  version: '0.8.0',
  git: 'https://github.com/meteor-velocity/html-reporter.git',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.1.0.2');
  api.use('grigio:babel@0.1.6');
  api.use('velocity:core@0.7.1', 'client');

  api.use(['underscore', 'templating','amplify@1.0.0', 'less'], 'client');

  api.addFiles('lib/reamplify.es6.js', 'client');

  api.addFiles('lib/velocity.es6.js', 'client');
  api.addFiles('lib/client-report.html', 'client');
  api.addFiles('lib/client-report.es6.js', 'client');
  api.addFiles('lib/client-report.less', 'client');
  api.addFiles('lib/status-widget.less', 'client');

  api.addFiles('lib/velocity-logo.png');
  api.addFiles('lib/velocity_cog.svg');
  api.addFiles('lib/icon-time.png');
});
