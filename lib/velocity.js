// Make Velocity globals available in this package
var packageContext = this;
_.forEach(Package['velocity:core'], function (globalValue, globalName) {
  packageContext[globalName] = globalValue;
});
