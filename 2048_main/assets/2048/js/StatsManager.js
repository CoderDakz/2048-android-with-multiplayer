function StatsManager ()
{
	// Record swipes for highscore
	this.highScoreSwipeDown = 0;
	this.highScoreSwipeLeft = 0;
	this.highScoreSwipeRigh = 0;
	this.highScoreSwipeUp = 0;

	//Added by Dylan
	this.highScore = 0;
	this.highScoreDate = 0;
	this.proDate = "";	// Process date

	// Record win/loss ratio
	this.wins = 0;
	this.loses = 0;
	this.Ties = 0;

	// Record player's overall swipes
	this.TotalSwipeDown = 0;
	this.TotalSwipeLeft = 0;
	this.TotalSwipeRight = 0;
	this.TotalSwipeUp = 0;

	// Generic record. Recorded to high score if new.
	this.swipeDown = 0;
	this.swipeLeft = 0;
	this.swipeRight = 0;
	this.swipeUp = 0;

	//GlobalStats
	this.GloHSDate = 0;
	this.GloHSSwipesDown = 0;
	this.GloHSSwipesLeft = 0;
	this.GloHSSwipesRight = 0;
	this.GloHSSwipesUp = 0;
	this.GloHSUsername = "";
	this.GloHighScore = 0;
	this.GloTotalSwipesDown = 0;
	this.GloTotalSwipesLeft = 0;
	this.GloTotalSwipesRight = 0;
	this.GloTotalSwipesUp = 0;
	this.GloUserCount = 0;

	// Turn to zero to turn off debug!
	this.debug = 0;			// For debugging swipe counts
	this.debug2 = 0;		// For debuggin win/lost counts
	this.debug3 = 0;		// For debuggin win/lost counts
}

StatsManager.prototype.getDirection = function (direction)
{
	// 0: up, 1: right, 2: down, 3: left
	if (direction == 0)
	{
		// document.getElementById("check").innerHTML = "Direction is " + direction; Debugging
		this.swipeUp += 1;
		this.TotalSwipeUp += 1;
	}
	else if (direction == 1)
	{
		// document.getElementById("check").innerHTML = "Direction is " + direction; Debugging
		this.swipeRight += 1;
		this.TotalSwipeRight += 1;
	}
	else if (direction == 2)
	{
		this.swipeDown += 1;
		this.TotalSwipeDown += 1;
	}
	else if (direction == 3)
	{
		this.swipeLeft += 1;
		this.TotalSwipeLeft += 1;
	}

	// Debugging
	if (this.debug)
	{
		document.getElementById("check").innerHTML = "Direction is " + direction;
		document.getElementById("upS").innerHTML = "Up swipes:" + this.swipeUp;
		document.getElementById("leftS").innerHTML = "Left swipes:" + this.swipeLeft;
		document.getElementById("rightS").innerHTML = "Right swipes:" + this.swipeRight;
		document.getElementById("downS").innerHTML = "Down swipes:" + this.swipeDown;
	}
};

StatsManager.prototype.showStats = function ()
{
	this.temp = "" + this.highScoreDate;
	this.proDate = this.temp.slice(0,2) + "/" + this.temp.slice(2,4) + "/" + this.temp.slice(4,8);
	document.getElementById("Hiswipe").innerHTML = "HighScore";
	document.getElementById("Total Swipe").innerHTML = "Total";
	document.getElementById("Up").innerHTML = "Swipes Up";
	document.getElementById("highUp").innerHTML = this.highScoreSwipeUp;
	document.getElementById("totalUp").innerHTML = this.TotalSwipeUp;
	document.getElementById("Left").innerHTML = "Swipes Left";
	document.getElementById("highLeft").innerHTML = this.highScoreSwipeLeft;
	document.getElementById("totalLeft").innerHTML = this.TotalSwipeLeft;
	document.getElementById("Down").innerHTML = "Swipes Down";
	document.getElementById("highDown").innerHTML = this.highScoreSwipeDown;
	document.getElementById("totalDown").innerHTML = this.TotalSwipeDown;
	document.getElementById("Right").innerHTML = "Swipes Right";
	document.getElementById("highRight").innerHTML = this.highScoreSwipeRigh;
	document.getElementById("totalRight").innerHTML = this.TotalSwipeRight;
	document.getElementById("highScore Label").innerHTML = "HighScore";
	document.getElementById("highScore").innerHTML = this.highScore;
	document.getElementById("HighScore Date Label").innerHTML = "Date";
	document.getElementById("HighScore Date").innerHTML = this.proDate;
	document.getElementById("Win Label").innerHTML = "Wins";
	document.getElementById("Win").innerHTML = this.wins;
	document.getElementById("Loss Label").innerHTML = "Losses";
	document.getElementById("Loss").innerHTML = this.loses;
	document.getElementById("Tie Label").innerHTML = "Ties";
	document.getElementById("Tie").innerHTML = this.Ties;
};

StatsManager.prototype.showGlobalStats = function ()
{
	// Process date into format 'dd/mm/yyyy'
	this.temp = "" + this.GloHSDate;
	this.proDate = this.temp.slice(0,2) + "/" + this.temp.slice(2,4) + "/" + this.temp.slice(4,8);
	// Post data to html page
	document.getElementById("userName").innerHTML = this.GloHSUsername;
	document.getElementById("globalHighScore").innerHTML = this.GloHighScore;
	document.getElementById("globalDate").innerHTML = this.proDate;
	document.getElementById("globalhighUp").innerHTML = this.GloHSSwipesUp;
	document.getElementById("globalhighLeft").innerHTML = this.GloHSSwipesLeft;
	document.getElementById("globalhighDown").innerHTML = this.GloHSSwipesDown;
	document.getElementById("globalrightLabel").innerHTML = this.GloHSSwipesRight;
	document.getElementById("globalTotalUp").innerHTML = this.GloTotalSwipesUp;
	document.getElementById("globalTotalLeft").innerHTML = this.GloTotalSwipesLeft;
	document.getElementById("globalTotalDown").innerHTML = this.GloTotalSwipesDown;
	document.getElementById("globalTotalRight").innerHTML = this.GloTotalSwipesRight;
	document.getElementById("userCount").innerHTML = this.GloUserCount;
};

// Used to clear current counts NOT total count or highscore
StatsManager.prototype.clearTempCount = function ()
{
	this.swipeUp = 0;
	this.swipeRight = 0;
	this.swipeDown = 0;
	this.swipeLeft = 0;

	 // Debugging
	if (this.debug)
	{
		document.getElementById("check").innerHTML = "";
		document.getElementById("upS").innerHTML = "Up Swipes:" + this.swipeUp;
		document.getElementById("leftS").innerHTML = "Left Swipes:" + this.swipeLeft;
		document.getElementById("rightS").innerHTML = "Right Swipes:" + this.swipeRight;
		document.getElementById("downS").innerHTML = "Down Swipes:" + this.swipeDown;
	}
};

//Change to accept the highscore
StatsManager.prototype.setHighScoreSwipes = function (score)
{
	this.highScoreSwipeDown = this.swipeDown;
	this.highScoreSwipeLeft = this.swipeLeft;
	this.highScoreSwipeRigh = this.swipeRight;
	this.highScoreSwipeUp = this.swipeUp;

	//Added by Dylan
	this.highScore = score;
	//Gets date in proper format
    var currentDate = new Date();
    this.highScoreDate = (("0" + currentDate.getDate()).slice(-2)) + ""
        + (("0" + (currentDate.getMonth()+1)).slice(-2)) + ""
        + (("0" + currentDate.getFullYear()).slice(-4));

	if (this.debug3)
	{
		document.getElementById("highUpS").innerHTML = "High Score Up swipes:" + this.swipeUp;
		document.getElementById("highLeftS").innerHTML = "High Score Left swipes:" + this.swipeLeft;
		document.getElementById("highRightS").innerHTML = "High Score Right swipes:" + this.swipeRight;
		document.getElementById("highLowS").innerHTML = "High Score Down swipes:" + this.swipeDown;
	}
};

StatsManager.prototype.setWin = function ()
{
	this.wins += 1;

	if (this.debug2)
	{
		document.getElementById("wins").innerHTML = "Wins: " + this.wins;
	}
};

StatsManager.prototype.setTies = function ()
{
	this.Ties += 1;
};

StatsManager.prototype.setLost = function ()
{
	this.loses += 1;

	if (this.debug2)
	{
		document.getElementById("losts").innerHTML = "Losts: " + this.loses;
	}
};

