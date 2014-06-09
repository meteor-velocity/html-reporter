Package.describe({
  summary: "Velocity HTML Reporter"
})

Package.on_use(function(api) {
  api.use(['velocity', 'templating','amplify', 'less'], "client");

  api.add_files('lib/client-report.html', 'client');
  api.add_files('lib/client-report.js', 'client');
  api.add_files('lib/client-report.less', 'client');
  api.add_files('lib/bootstrap.less', 'client');
  api.add_files('lib/bootstrap/fonts/glyphicons-halflings-regular.eot', 'client');
  api.add_files('lib/bootstrap/fonts/glyphicons-halflings-regular.ttf', 'client');
  api.add_files('lib/bootstrap/fonts/glyphicons-halflings-regular.woff', 'client');
});
