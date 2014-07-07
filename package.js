Package.describe({
  summary: "Reactive Velocity test reports in your app."
})

Package.on_use(function(api) {
  api.use(['velocity', 'templating','amplify', 'less'], "client");
  
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

  // api.export('reamplify', ['client']);
});
