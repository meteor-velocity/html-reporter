// A reactive version of amplify.store(). This object acts a little like the Session object, but
// the key/value store is persisted on the client using amplify, so it survives page refresh
// and retains its values between sessions.

reamplify = {
  deps: {},
  store: function (key, value) {
    var self = this;
    if (value === null) {
      //delete key
      if (self.deps[key])
        delete self.deps[key];
      return amplify.store(key, null);
    }
    else if (value !== undefined) {
      //add/update
      var previousValue = amplify.store(key);
      if (self.deps[key] && value !== previousValue){
        self.deps[key].changed()
      }
      return amplify.store(key, value); 
    }
    else if (key) {
      // get value of key
      var result;
      result = amplify.store(key);
      if (! self.deps[key]) 
        self.deps[key] = new Deps.Dependency
      self.deps[key].depend();
      return result;
    }
    else {
      //not implemented
      throw new Error ('reAmplify cannot reactively return the entire amplify store. ' +
        'Use amplify.store() instead');
    };
  }
};