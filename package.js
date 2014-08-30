Package.describe({
  summary: "Reactive Velocity test reports in your app.",
  version: "0.1.5",
  git: "https://github.com/rdickert/velocity-html-reporter.git"
});

Package.on_use(function(api) {
  if (api.versionsFrom) {
    api.versionsFrom("METEOR@0.9.0");
    api.use('xolvio:velocity@0.1.18', 'client');
  } else {
    api.use('velocity', 'client');
  }

  api.use(['templating','amplify', 'less'], "client");
  
  api.add_files('lib/reamplify.js', 'client');

  api.add_files('lib/client-report.html', 'client');
  api.add_files('lib/client-report.js', 'client');
  api.add_files('lib/client-report.less', 'client');
  api.add_files('lib/status-widget.less', 'client');

  //bootstrap glyphicons
  api.add_files('lib/bootstrap/src/fonts/glyphicons-halflings-regular.eot', 'client');
  api.add_files('lib/bootstrap/src/fonts/glyphicons-halflings-regular.ttf', 'client');
  api.add_files('lib/bootstrap/src/fonts/glyphicons-halflings-regular.woff', 'client');
  api.add_files('lib/bootstrap/src/fonts/glyphicons-halflings-regular.svg', 'client');

  api.add_files('lib/spinner.gif');

  // api.export('reamplify', ['client']);
});
