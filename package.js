Package.describe({
  summary: "Velocity HTML Reporter"
})

Package.on_use(function(api) {
  api.use(['velocity', 'templating','amplify'], "client");

  api.add_files('lib/client-report.html', 'client');
  api.add_files('lib/client-report.js', 'client');
});
