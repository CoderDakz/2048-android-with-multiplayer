function KeyboardInputManager() {
  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restartWithConfirmation);
  //this.bindButtonPress(".undo-button", this.undoWithConfirmation);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);
  //this.bindButtonPress(".undo-move-button", this.undoMove);
  this.bindButtonPress(".confirm-button", this.restart);    
  this.bindButtonPress(".cancel-button", this.keepPlaying);
  this.bindButtonPress(".cancel2-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".cancel3-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".cancel4-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".cancel5-button", this.keepPlaying);
  this.bindButtonPress(".cancel6-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".cancel7-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".cancel8-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".cancel9-button", this./*cancel*/keepPlaying);
  this.bindButtonPress(".night-button", this.nightMode);
  this.bindButtonPress(".main-button", this.mainMenu);
  this.bindButtonPress(".account-button", this.accountMenu);
  this.bindButtonPress(".friend-button", this.friendsList);
  this.bindButtonPress(".login-button", this.login);
  this.bindButtonPress(".create-button", this.createMenu);
  this.bindButtonPress(".createAcc-button", this.createAccount);
  this.bindButtonPress(".backCreate-button", this.backCreate);
  this.bindButtonPress(".backLogin-button", this.backLogin);
  this.bindButtonPress(".okay-button", this.keepPlaying);
  this.bindButtonPress(".stats-button", this.loadStats);
  this.bindButtonPress(".your-stats-button", this.yourLoadStats);
  this.bindButtonPress(".add-button", this.addFriend);
  this.bindButtonPress(".logout-button", this.logout);
  this.bindButtonPress(".challenge-button", this.challenge);
  this.bindButtonPress(".globalStats-button", this.globalStats);
  this.bindButtonPress(".pg1-button", this.globalStats);
  this.bindButtonPress(".pg2-button", this.globalStats2);
  this.bindButtonPress(".multiplayer-button", this.multiplayerMenu);
  this.bindButtonPress(".High-score-Button", this.highScoreStats);
  this.bindButtonPress(".accept-button", this.acceptInvite);
  this.bindButtonPress(".reject-button", this.rejectInvite);
  this.bindButtonPress(".cancelInvite-button", this.cancelInvite);
  this.bindButtonPress(".newGame-button", this.newGame);


};

KeyboardInputManager.prototype.yourLoadStats = function (event) {
  event.preventDefault();
  this.emit("loadStats");
};

KeyboardInputManager.prototype.globalStats2 = function(event) {
  event.preventDefault();
  this.emit("globalStats2");
}

KeyboardInputManager.prototype.highScoreStats = function (event) {
  event.preventDefault();
  this.emit("highScoreStats");
};

KeyboardInputManager.prototype.newGame = function(event) {
    event.preventDefault();
    this.emit("restart");
}

KeyboardInputManager.prototype.cancelInvite = function(event) {
    event.preventDefault();
    this.emit("cancelInvite");
}

KeyboardInputManager.prototype.rejectInvite = function(event) {
    event.preventDefault();
    this.emit("rejectInvite");
}

KeyboardInputManager.prototype.acceptInvite = function(event) {
    event.preventDefault();
    this.emit("acceptInvite");
}

KeyboardInputManager.prototype.multiplayerMenu = function(event) {
    event.preventDefault();
    this.emit("multiplayerMenu");
}

KeyboardInputManager.prototype.globalStats = function(event) {
    event.preventDefault();
    this.emit("globalStats");
}


KeyboardInputManager.prototype.backLogin = function(event) {
    event.preventDefault();
    this.emit("keepPlaying");
}

KeyboardInputManager.prototype.backLogin = function(event) {
  event.preventDefault();
  //This fires the same event because as account menu because we want the button to just load the menu up again
  this.emit("accountMenu");
}

KeyboardInputManager.prototype.backCreate = function(event) {
  event.preventDefault();
  //This fires the same event because as create menu because we want the button to just load the menu up again
  this.emit("createMenu");
}

KeyboardInputManager.prototype.createAccount = function(event) {
  event.preventDefault();
  this.emit("createAccount");
}

KeyboardInputManager.prototype.createMenu = function(event) {
  event.preventDefault();
  this.emit("createMenu");
}

KeyboardInputManager.prototype.friendsList = function(event) {
  event.preventDefault();
  this.emit("friendsList");
}

KeyboardInputManager.prototype.cancel = function(event) {
  event.preventDefault();
  this.emit("cancel");
}

KeyboardInputManager.prototype.nightMode = function (event) {
  event.preventDefault();
  this.emit("nightMode");
};

KeyboardInputManager.prototype.login = function (event) {
  event.preventDefault();
  this.emit("login");
};

KeyboardInputManager.prototype.mainMenu = function (event) {
  event.preventDefault();
  this.emit("mainMenu");
};

KeyboardInputManager.prototype.accountMenu = function (event) {
  event.preventDefault();
  this.emit("accountMenu");
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.restartWithConfirmation = function (event) {
  event.preventDefault();
  this.emit("restartWithConfirmation");
};


KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.loadStats = function (event) {
  event.preventDefault();
  this.emit("loadStats");
};

KeyboardInputManager.prototype.logout = function(event) {
    event.preventDefault();
    this.emit("logout");
};

KeyboardInputManager.prototype.addFriend = function(event) {
    event.preventDefault();
    this.emit("addFriend");
};

KeyboardInputManager.prototype.challenge = function(event) {
    event.preventDefault();
    this.emit("challenge");
};


KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};
