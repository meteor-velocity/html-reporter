// A reactive version of amplify.store(). This object acts a little like the Session object, but
// the key/value store is persisted on the client using amplify, so it survives page refresh
// and retains its values between sessions.

reamplify = {
  deps: {},
  store: function (key, value) {
    var self = this;
    console.log (this.deps)
    if (value === null) {
      //delete key
      if (self.deps[key])
        delete self.deps[key];
      console.log(self.deps);
      return amplify.store(key, null);
    }
    else if (value) {
      //add/update
      var previousValue = amplify.store(key);
      if (self.deps[key] && value !== previousValue)
        self.deps[key].changed()
      console.log(self.deps);
      return amplify.store(key, value); 
    }
    else if (key) {
      // get value of key
      var result;
      result = amplify.store(key);
      if (! self.deps[key]) 
        self.deps[key] = new Deps.Dependency
      self.deps[key].depend();
      console.log(self.deps);
      return result;
    }
    else {
      //not implemented
      throw new Error ('reAmplify cannot reactively return the entire amplify store. ' +
        'Use amplify.store() instead');
    };
  }
};