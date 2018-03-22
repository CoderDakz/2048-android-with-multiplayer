function GameManager(size, InputManager, Actuator, StorageManager, touchManager, StatsManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.startTiles     = 2;
  this.db             = new DBHandler();
  this.touchMan       = new touchManager;
  this.StatsMan       = new StatsManager;
  this.username       = "";
  this.type           = 0;
  this.challengeGo    = false;
  this.opponent       = false;
  this.opponentName   = "";
  this.challengerName = "";
  this.winner         = "";

  this.touchMan.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  //this.inputManager.on("undoMove", this.undoMove.bind(this));
  this.inputManager.on("restartWithConfirmation", this.restartWithConfirmation.bind(this));
  //this.inputManager.on("undoWithConfirmation", this.undoWithConfirmation.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
  this.inputManager.on("nightMode", this.nightMode.bind(this));
  this.inputManager.on("mainMenu", this.mainMenu.bind(this));
  this.inputManager.on("accountMenu", this.accountMenu.bind(this));
  this.inputManager.on("login", this.login.bind(this));
  this.inputManager.on("createMenu", this.createMenu.bind(this));
  this.inputManager.on("cancel", this.cancel.bind(this));
  this.inputManager.on("createAccount", this.createAccount.bind(this));
  this.inputManager.on("friendsList", this.friendsList.bind(this));
  this.inputManager.on("addFriend", this.addFriend.bind(this));
  this.inputManager.on("logout", this.logout.bind(this));
  this.inputManager.on("loadStats", this.loadStats.bind(this));
  this.inputManager.on("challenge", this.challenge.bind(this));
  this.inputManager.on("showOther", this.showOtherStats.bind(this));
  this.inputManager.on("globalStats", this.globalStats.bind(this));
  this.inputManager.on("globalStats2", this.globalStats2.bind(this));
  this.inputManager.on("multiplayerMenu", this.multiplayerMenu.bind(this));
  this.inputManager.on("highScoreStats", this.highScoreStats.bind(this));
  this.inputManager.on("acceptInvite", this.acceptInvite.bind(this));
  this.inputManager.on("cancelInvite", this.cancelInvite.bind(this));
  this.inputManager.on("rejectInvite", this.rejectInvite.bind(this));

  //this.inputManager.on("testInput", this.testInput.bind(this));

  this.setup();

}
var timerId        = "";

GameManager.prototype.highScoreStats = function () {
  this.actuator.HighScoreData();
};

GameManager.prototype.globalStats = function () {
    DBUtil.getGlobalStats(this, "show");
};

GameManager.prototype.globalStats2 = function () {
    this.actuator.globallist2();
};

GameManager.prototype.cancelInvite = function () {
    DBUtil.cancelGameInvite(this.username, this);
}

GameManager.prototype.rejectInvite = function () {
    DBUtil.rejectGameInvite(this.username, this);
}

GameManager.prototype.acceptInvite = function () {
    DBUtil.acceptGameInvite(this);
}


GameManager.prototype.multiplayerMenu = function () {
    DBUtil.utilities(this.username, "", "", "", "getFriendsM", this);
};

GameManager.prototype.onTimer = function (gm) {
    var curGameTime = document.getElementById("timer").innerHTML;
    if (curGameTime > 0) {
        document.getElementById("timer").innerHTML = curGameTime - 1;
    } else {
        //Game over
        clearInterval(timerId);
        document.getElementById("timer").innerHTML = "";
        if (gm.over !== true){
            gm.over = true;
            gm.actuate();
        }
    }
}

// Restart the game
GameManager.prototype.restart = function () {
  this.touchMan.menuClose();

  DBUtil.getUserStats(this.username, this);
  DBUtil.getUserStatsWLT(this.username, this);
  this.storageManager.clearGameState();

  if (this.username != "")
  {
    this.StatsMan.clearTempCount();
  }


  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
  var self = this;
  if(this.challengeGo === true) {
    document.getElementById("timer").innerHTML = 60;
    timerId = setInterval(function(){ self.onTimer(self); }, 1000);
  }
};

//Enable night mode
GameManager.prototype.nightMode = function () {
  if (document.getElementsByTagName("html")[0].style.backgroundColor === "rgb(45, 48, 44)") {
    document.getElementsByTagName("html")[0].style.backgroundColor = "#faf8ef";
    document.getElementsByTagName("body")[0].style.backgroundColor = "#faf8ef";
    return false;
  } else {
      document.getElementsByTagName("html")[0].style.backgroundColor = "#2D302C";
      document.getElementsByTagName("body")[0].style.backgroundColor = "#2D302C";
      return false;
  }
};

GameManager.prototype.loadStats = function () {
  if (this.username == "")
  {
    this.actuator.notLoggedIn();
    document.getElementById("Stats table").style.visibility = "hidden";
  }
  else
  {
    this.actuator.statslist();
    this.StatsMan.showStats();
    document.getElementById("Stats table").style.visibility = "visible";
  }
};


GameManager.prototype.showOtherStats = function () {

  if (this.type == 0)
  {
    this.actuator.HighScoreData();
    this.StatsMan.HiScoreData();
    document.getElementById("global-high").textContent = "Global";
    this.type += 1;
  }
  else if (this.type == 1)
  {
    this.actuator.globallist();
    this.StatsMan.showGlobalStats();
    document.getElementById("global-high").textContent = "Stats";
    this.type += 1;
  }
  else
  {
    this.actuator.statslist();
    this.StatsMan.showStats();
    document.getElementById("global-high").textContent = "HiScore";
    this.type = 0;
  }
};

// Restart the game after user confirmation
GameManager.prototype.restartWithConfirmation = function () {
    // Open confirm message
    if(this.challengeGo !== true) {
        this.actuator.promptRestart();
    }
};

GameManager.prototype.createAccount = function () {
  var self = this;
  var user = document.getElementById("new-username").value
  var email = document.getElementById("new-email").value
  var pass = document.getElementById("new-password").value
  var confirmPass = document.getElementById("new-confirmPassword").value

  if(pass === confirmPass)
  {
    DBUtil.utilities(user, email, pass, "", "create", self);
    document.forms['createForm'].reset();
  } else {
    // handle error check
    this.actuator.createAccErrorMessage("Error in creating account");
  }
};

GameManager.prototype.cancel = function ()
{
  this.actuator.clearMessage();
  this.touchMan.menuClose();
};

GameManager.prototype.login = function () {
  //Implement login here
  var self = this;
  var user = document.getElementById("userNameIn").value;
  var pass = document.getElementById("passIn").value;
  DBUtil.utilities(user, "", pass, "", "login", self);
};

GameManager.prototype.logout = function () {
    this.username = "";
    this.actuator.clearMessage();
    this.actuator.userClear();
};

GameManager.prototype.addFriend = function ()
{
    var self = this;
    var friend = document.getElementById("newFriend").value;
    DBUtil.utilities(this.username, "", "", friend, "requestFriend", self)
};

GameManager.prototype.createMenu = function () {
  this.actuator.createMenu();
};

GameManager.prototype.challenge = function () {
  var friend = document.getElementById("friend-challenge").value;
  DBUtil.friendUtil(this.username, friend, this, "Challenge");
};

GameManager.prototype.mainMenu = function () 
{
    this.actuator.mainMenu();
    this.touchMan.menuActive(); // Set the touch management to sleep. Does not work.
};

GameManager.prototype.accountMenu = function() {
    if(this.username === "") {
        this.actuator.accountMenu();
    } else {
        //input code for showing friends and what not: Loug out button and so on
        this.actuator.accountLoginMenu();
    }
};

GameManager.prototype.friendsList = function() {
    if (this.username == "")
    {
      this.actuator.notLoggedIn();
      document.getElementById("Stats table").style.visibility = "hidden";
      document.getElementById("Other Stats").style.visibility = "hidden";
    }
    else
    {
      var self = this;
      DBUtil.utilities(this.username, "", "", "", "getFriends", self);
    }
};

// Keep playing after winning (allows going over 2048)

GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
  this.actuate();
  this.touchMan.menuClose();
};

// Return true if the game is lost, or has won and the user hasn't kept playing

GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game

GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();
  // Reload the game from a previous game if present

  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with

GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position

GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);
    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function (){
var self = this;
  if (this.storageManager.getBestScore() < this.score)
  {
    this.storageManager.setBestScore(this.score);
//Shouldn't be in here
    /*if (this.username != "")
    {
      if (this.StatsMan.highScore < this.score)
      {
        this.StatsMan.setHighScoreSwipes(this.score);
      }
    } */
  }
//Should be here
  if (this.username != "") {
    if (this.StatsMan.highScore < this.score) {
        this.StatsMan.setHighScoreSwipes(this.score);
    }
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    //Firebase Stats code
    if (this.username != "") {
        //Multiplayer
        if (this.challengeGo === true) {
            DBUtil.sendGameScore(this.username, self);
        }

        //Database stuff!
        DBUtil.getUserStatsWLT(this.username, self);
        DBUtil.utilities(this.username, "", "", "", "setStats", self);

    }

    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
    this.storageManager.pushGameState(this.serialize());            
  }
  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated(),
    keepPlaying: this.keepPlaying
  });
};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info

GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation

GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction

GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  if (this.touchMan.sleep == 1) { return}

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

//Records the number of swipes
  if (this.username != "")
  {
    this.StatsMan.getDirection(direction);    
  }

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);
      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];
          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();
    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }
    this.actuate();
  }
};

// Get the vector representing the chosen direction

GameManager.prototype.getVector = function (direction) {

  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };
  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };
  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();
  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {

  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));
  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;
  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });
      if (tile) {
        for (var direction = 0; direction < 2; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };
          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
