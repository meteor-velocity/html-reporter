Velocity HTML Reporter
======================
HTML reporter for Meteor's [Velocity testing framework](https://velocity.meteor.com). This reporter
will show you test results in your app.

## To use
Install this and at least one Velocity-compatible testing framework then add this package:

`meteor add velocity:html-reporter`

## Settings
You can set the position of the reporter by adding a settings file like this:

```
{
  "public": {
    "velocity:html-reporter": {
      "position": "bottom right",
      "tab-index" : 1
    }
  }
}
```

Available positional options are:
* `"top right"`
* `"top left"`
* `"bottom right"`
* `"bottom left"`

The "tab-index" field is used for people with disabilities to access the reporter via keyboard
shortcuts.


You may also be interested in the [`velocity:console-reporter` package](https://github.com/meteor-velocity/console-reporter/)