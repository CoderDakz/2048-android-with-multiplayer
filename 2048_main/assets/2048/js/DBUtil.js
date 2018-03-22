//Utility JS class for the firebase database
//Created for our CIS*3760 group project at the University Of Guelph
//Initially created by Dylan G. on March 2nd, 2017
//Additional modifications:

function DBUtil(){}

//Function for handling utilities of the database
//Takes in a username, email and password
//(email is not blank if its creation, blank if otherwise)
//A variable stating the task for the function, ie. logging in, creation, adding friends etc.
//And the game manager
DBUtil.utilities = function(username, email, password, friend, task, gm) {
    var db = gm.db;
    //Checks to make sure the username exists
    db.fb.database().ref('/Users/').once('value', function(ss) {
        //If it exists, tasks are create/friends/login
        if(ss.hasChild(username)) {
            if(task === "create") {
                //For creating a user
                DBUtil.usernameInUse(gm);
            } else if(task === "requestFriend") {
                db.fb.database().ref("Users").once("value", function(sss) {
                    if(sss.hasChild(friend)) {
                        //For friend's list stuff
                        DBUtil.friendUtil(username, friend, gm, "");
                    } else {
                        //Friend Does Not Exist
                        DBUtil.userDNE(friend, gm);
                    }
                });
            } else if(task === "login") {
                //If attempting to login, check for a password match
                DBUtil.checkPassword(password, username, gm);
            } else if (task === "getFriends" || task === "getFriendsM") {
                //Grabbing all the friends of a user
                DBUtil.getFriends(username, gm, task);
            } else if(task === "setStats") {
                //Set the required stats
                DBUtil.setStats(username, gm);
            }
        } else {
            if(task === "create") {
                DBUtil.createUser(username, password, email, gm);
            } else if(task === "requestFriend") {
                gm.actuator.loginErrorMessage("Friend does not exist!");
                //Call other code
            } else if(task === "login") {
                DBUtil.invalidLogin(gm);
            }
        }
    });
}

//Function for checking if a user's password is correct
//Takes in a password from the login screen, the username, and the game manager
//Calls invalidLogin on invalid password, or validLogin for the contrary
DBUtil.checkPassword = function(password, username, gm) {
    var userRef = gm.db.fb.database().ref('/Users/' + username);

    userRef.once('value', function(ss) {
        if(ss.val().Password === password) {
            DBUtil.validLogin(username, gm);
        } else {
            DBUtil.invalidLogin(gm);
        }
    });
}

//Function to print username taken to device
//Takes in the game manager
DBUtil.usernameInUse = function(gm) {
    //Show on device that username is taken
    gm.actuator.loginErrorMessage("Username is already taken!");
}

//Function to print invalid login to device
//Takes in a game manager
DBUtil.invalidLogin = function(gm) {
    //Change the HTML to say invalid login and request new attempt
    //Prints: "Invalid login. Username and Password ARE case sensitive. Try again."
    gm.actuator.loginErrorMessage("Username and Password combination does not exist. Try again.");
}

//Function that sets the game's login variables on the device
DBUtil.validLogin = function(user, gm) {
    //sets games username's variable to the given username??? other code here
    gm.username = user;
    gm.cancel();
    gm.actuator.okayMessage("Login successful.");
    gm.actuator.userUpdate(user);
    DBUtil.getUserStats(user, gm);
    DBUtil.getUserStatsWLT(user, gm);
    document.getElementById('passIn').value=null;
    DBUtil.startGameInvitationListener(user, gm);
}

//Function for creating a new user
//Takes in a username, password and email from the login screen, and the game manager
//Makes sure that user requirements are met, calls invalidCreation if they are not
//Creates bare user otherwise
DBUtil.createUser = function(username, password, email, gm) {
    var P = 'F', U = 'F', E = 'F';

    //Makes sure the user requirements are met
    if (password.length < 5 || username.length < 5 || email.length < 5) {
        if (password.length < 5) {
            P = 'T';
        }
        if (username.length < 5) {
            U = 'T';
        }
        if (email.length < 5) {
            E = 'T';
        }
        DBUtil.invalidCreation(P,U,E, gm);
    } else {
        //Gets date in proper format
        var currentdate = new Date();
        var datetime = (("0" + currentdate.getDate()).slice(-2)) + ""
            + (("0" + (currentdate.getMonth()+1)).slice(-2)) + ""
            + (("0" + currentdate.getFullYear()).slice(-4)) + ":"
            + (("0" + currentdate.getHours()).slice(-2)) + ""
            + (("0" + currentdate.getMinutes()).slice(-2)) + ""
            + (("0" + currentdate.getSeconds()).slice(-2));

        userRef = gm.db.fb.database().ref('/Users/' + username);
        userRef.set({
            Password: password,
            Email: email,
            //Creation date is format DDMMYYYY:HHmmSS
            CreationStamp: datetime,
            HighScore: 0,
            //Date is format DDMMYYYY
            HighScoreDate: "00000000",
            HighScoreSwipesUp: 0,
            HighScoreSwipesDown: 0,
            HighScoreSwipesLeft: 0,
            HighScoreSwipesRight: 0,
            TotalSwipesUp: 0,
            TotalSwipesDown: 0,
            TotalSwipesLeft: 0,
            TotalSwipesRight: 0,
            Friends: {
                NumFriends: 0
            },
            FriendsWaiting: {
                NumFriends: 0
            },
            FriendsPending: {
                NumFriends: 0
            },
            GameInvitation: 0,
            Wins: 0,
            Losses: 0,
            Ties: 0
        });

        gm.db.fb.database().ref("GlobalStats").once("value", function(ss){
            DBUtil.addToUserCount(gm.db, ss.val().UserCount);
        });

        gm.cancel();
        gm.actuator.okayMessage("Account created.");
    }
}

//Function that adds to the usercount in game stats
//Takes in the firebase database and the count of previous users
DBUtil.addToUserCount = function(db, count) {
    db.fb.database().ref("GlobalStats").update({
        UserCount: (count + 1)
    });
}

//Function that lets the user know what is wrong with the user details
//Takes in 3 'T' or 'F' variables, to state which properties have issues
//And the game manager
DBUtil.invalidCreation = function(P,U,E, gm) {
    var message = "";

    if(U === "T") {
        message += "Username has to be at least 5 characters long. ";
    }
    if(P === "T") {
        message += "Password has to be at least 5 characters long. ";
    }
    if(E === "T") {
        message += "Email has to be at least 5 characters long.";
    }

    gm.actuator.loginErrorMessage(message);
}


//Function that gets the amount of friends in a particular subdirectory
//Takes in a username, the friend's username, the task, and the firebase database
DBUtil.friendUtil = function(username, friend, gm, task) {
    var userRef = gm.db.fb.database().ref("/Users/" + username);
    var friendRef = gm.db.fb.database().ref("/Users/" + friend);

    userRef.child("Friends").once("value", function(ss) {
        var hasFriend = false;
        hasFriend = ss.forEach(function (snap) {
            if(snap.val() === friend && task !== "Challenge") {
                //User already has the friend!
                DBUtil.friendAlreadyExists("You are already friends with this user!" ,gm);
                return true;
            } else if (snap.val() === friend && task === "Challenge") {
                return true;
            }
        });

        if (hasFriend === false && task !== "Challenge") {
            userRef.child("FriendsWaiting").once("value", function(ss) {
                var hasFriendWait = false;
                hasFriendWait = ss.forEach(function (snap) {
                    if(snap.val() === friend) {
                        //User already has the friend!
                        DBUtil.friendAlreadyExists("You have already sent a friend request to this user!", gm);
                        return true;
                    }
                });

                if (hasFriendWait === false) {
                    userRef.child("FriendsPending").once("value", function(ss) {
                        var hasFriendPend = false;
                        hasFriendPend = ss.forEach(function (snap) {
                            if(snap.val() === friend) {
                                //User already has the friend!
                                return true;
                            }
                        });

                        if (hasFriendPend === false) {
                            //Sending Request
                            userRef.child("FriendsWaiting").once("value", function(sss) {
                                DBUtil.requestFriend(friend, sss.val().NumFriends, userRef.child("FriendsWaiting"), gm);
                            });
                            friendRef.child("FriendsPending").once("value", function(sss) {
                                DBUtil.requestFriend(username, sss.val().NumFriends, friendRef.child("FriendsPending"), gm);
                            });
                            gm.actuator.okayMessage("Friend request sent!");
                        } else {
                            //Accepting
                            friendRef.child("FriendsWaiting").once("value", function(sss) {
                                DBUtil.acceptFriend(sss.val().NumFriends, friendRef.child("FriendsWaiting"), username);
                            });
                            userRef.child("FriendsPending").once("value", function(sss) {
                                DBUtil.acceptFriend(sss.val().NumFriends, userRef.child("FriendsPending"), friend);
                            });

                            //Adding
                            userRef.child("Friends").once("value", function(sss) {
                                DBUtil.addFriend(friend, sss.val().NumFriends, userRef.child("Friends"));
                            });
                            friendRef.child("Friends").once("value", function(sss) {
                                DBUtil.addFriend(username, sss.val().NumFriends, friendRef.child("Friends"));
                            });
                            gm.actuator.okayMessage("Friend added!");
                        }
                    });
                }
            });
        } else if (hasFriend === false && task === "Challenge") {
            DBUtil.userDNE(friend, gm);
        } else if (hasFriend === true && task === "Challenge") {
            DBUtil.sendGameInvitation(username, friend, gm);
        }
    });
}

//Function that sends a friend request to another user
//Takes in a friend's username, count of previous friends in the subdirectory
//And the game managaer
DBUtil.requestFriend = function(friend, count, userRef, gm) {
    var sub = "Friend" + (count + 1);
    path = {};
    path[sub] = friend;
    userRef.update(path);
    DBUtil.increaseFriendCount(userRef, count, 1);
}

//Function that accepts a friend request from another user
//Takes in a count of previous friends in the subdirectory
//And the firebase database referencing the user
DBUtil.acceptFriend = function(count, userRef, user) {
     userRef.once("value", function(ss) {
         var friend = "";
         var post = {};
         var sub = "";

         for(var i = 1; i <= count; i++) {
            friend = ss.child("Friend" + i).val();
            if (friend === user) {
                for (var j = i; j < count; j++) {
                    sub = "Friend" + j;
                    post[sub] = ss.child("Friend" + (j + 1)).val();
                }
                sub = "Friend" + count;
                post[sub] = null;
                userRef.update(post);
                break;
            }
        }
     });
     DBUtil.increaseFriendCount(userRef, count, -1);
}

//Function that adds a friend to a user's friends list
//Takes in a username, the friend's username, and the firebase database
DBUtil.addFriend = function(friend, count, userRef) {
    var sub = "Friend" + (count + 1);
    path = {};
    path[sub] = friend;
    userRef.update(path);
    DBUtil.increaseFriendCount(userRef, count, 1);
}

//Function that increases or decreases the NumFriends variable in any subdirectory
//Takes in a reference to the targeted location, the previous count, and the value to add to it
DBUtil.increaseFriendCount = function(userRef, count, value) {
    userRef.update({
        NumFriends: (count + value)
    });
}

//Function that tells the user that they are already friends with chosen user
DBUtil.friendAlreadyExists = function(message, gm) {
    gm.actuator.loginErrorMessage(message);
}

//Function that tells the user that a user does not exist
//Takes in a username and the game manager
DBUtil.userDNE = function(user, gm) {
    gm.actuator.loginErrorMessage("User " + user + " does not exist!");
}

//Function that grabs all of the user's friends
//Takes in a username and the game manager
DBUtil.getFriends = function(user, gm, task) {
    var userRef = gm.db.fb.database().ref("Users/" + user + "/Friends").once("value", function(ss) {
        var num = ss.val().NumFriends;
        var friend = "";
        var end = 0;
        gm.friendsString = "";

        if(num == 0) {
            gm.friendsString = "You have no friends to show";
            if(task === "getFriends") {
                document.getElementById("friends-list").value = gm.friendsString;
                DBUtil.getFriendsPending(user, gm);
            } else {
                document.getElementById("friends-highscoreList").value = gm.friendsString;
                gm.actuator.multiplayerMenu();
            }
        } else {
            for(var i = 1; i <= num; i++) {
                friend = ss.child("Friend" + i).val();
                if (i == num) {
                    end = 1;
                }
                if (task === "getFriendsM") {
                    DBUtil.updateFriendsList(friend, user, gm, end);
                } else {

                    if (end != 1) {
                        gm.friendsString = gm.friendsString + friend + ", ";
                    } else {
                        gm.friendsString = gm.friendsString + friend;
                        document.getElementById("friends-list").value = gm.friendsString;
                        DBUtil.getFriendsPending(user, gm);
                    }
                }
            }

        }
    });
}

//Function to append to the friends string in game manager
//Takes in a friend, the game manager and an end flag
DBUtil.updateFriendsList = function(friend, user, gm, end) {
    gm.db.fb.database().ref("Users/" + friend).once("value", function(sss) {
        gm.friendsString = gm.friendsString + friend + ": ";

        if (end != 1) {
            gm.friendsString = gm.friendsString + sss.val().HighScore + ", ";
        } else {
            gm.friendsString = gm.friendsString + sss.val().HighScore;
            document.getElementById("friends-highscoreList").value = gm.friendsString;
            gm.actuator.multiplayerMenu();
        }
    });
}

//Function that grabs all of the user's pending friends
//Takes in a username and the game manager
DBUtil.getFriendsPending = function(user, gm) {
    var userRef = gm.db.fb.database().ref("Users/" + user + "/FriendsPending").once("value", function(ss) {
        var num = ss.val().NumFriends;
        var friend = "";
        var end = 0;
        gm.friendsPendingString = "";

        if(num == 0) {
            gm.friendsPendingString = "You have no pending friends";
            document.getElementById("friendsPending").value = gm.friendsPendingString;
        } else {
            for(var i = 1; i <= num; i++) {
                friend = ss.child("Friend" + i).val();

                if(i == num)
                {
                    gm.friendsPendingString += friend + "";
                }
                else
                {
                    gm.friendsPendingString += friend + ", ";
                }

            }
            document.getElementById("friendsPending").value = gm.friendsPendingString;
        }
        gm.actuator.friendsList();
    });
}

//Function to grab a users stats
//Takes in a username and the game manager
DBUtil.getUserStats = function(user, gm) {
    gm.db.fb.database().ref("Users/" + user).once("value", function(ss) {
        //Sets the StatsManager's values once logged in
        gm.StatsMan.highScore = ss.val().HighScore;
        gm.StatsMan.highScoreDate = ss.val().HighScoreDate;
        gm.StatsMan.highScoreSwipeUp = ss.val().HighScoreSwipesUp;
        gm.StatsMan.highScoreSwipeDown = ss.val().HighScoreSwipesDown;
        gm.StatsMan.highScoreSwipeLeft = ss.val().HighScoreSwipesLeft;
        gm.StatsMan.highScoreSwipeRigh = ss.val().HighScoreSwipesRight;
        gm.StatsMan.TotalSwipeUp = ss.val().TotalSwipesUp;
        gm.StatsMan.TotalSwipeDown = ss.val().TotalSwipesDown;
        gm.StatsMan.TotalSwipeLeft = ss.val().TotalSwipesLeft;
        gm.StatsMan.TotalSwipeRight = ss.val().TotalSwipesRight;
    });
}

//Function to grab a users win/loss/tie
//Takes in a username and the game manager
DBUtil.getUserStatsWLT = function(user, gm) {
    gm.db.fb.database().ref("Users/" + user).once("value", function(ss) {
        gm.StatsMan.wins = ss.val().Wins;
        gm.StatsMan.loses = ss.val().Losses;
        gm.StatsMan.Ties = ss.val().Ties;
    });
}


//Function to sets Stats
//Takes in a username and the game manager
DBUtil.setStats = function(user, gm) {
    gm.db.fb.database().ref("GlobalStats").once("value", function(ss){
        if(ss.val().HighScore < gm.StatsMan.highScore) {
            DBUtil.setGlobalStatsHS(user, gm);
        }
    });
    DBUtil.setUserStats(user, gm);
    DBUtil.setGlobalStatsTotals(gm);

}

//Function to set a user's stats
//Takes in a username and the game manager
DBUtil.setUserStats = function(user, gm) {

    gm.db.fb.database().ref("Users/" + user).update({
        //Sets the StatsManager's values once logged in
        HighScore: gm.StatsMan.highScore,
        HighScoreDate: gm.StatsMan.highScoreDate,
        HighScoreSwipesUp: gm.StatsMan.highScoreSwipeUp,
        HighScoreSwipesDown: gm.StatsMan.highScoreSwipeDown,
        HighScoreSwipesLeft: gm.StatsMan.highScoreSwipeLeft,
        HighScoreSwipesRight: gm.StatsMan.highScoreSwipeRigh,
        TotalSwipesUp: gm.StatsMan.TotalSwipeUp,
        TotalSwipesDown: gm.StatsMan.TotalSwipeDown,
        TotalSwipesLeft: gm.StatsMan.TotalSwipeLeft,
        TotalSwipesRight: gm.StatsMan.TotalSwipeRight,
        Wins: gm.StatsMan.wins,
        Losses: gm.StatsMan.loses,
        Ties: gm.StatsMan.Ties
    });
    DBUtil.getUserStatsWLT(user, gm);
    DBUtil.getUserStats(user, gm);
}

//Function to set the global stats highscore
//Takes in a user and the game manager
DBUtil.setGlobalStatsHS = function(user, gm) {
    gm.db.fb.database().ref("GlobalStats").update({
        //Sets the Global Stats values for HighScore
        HighScore: gm.StatsMan.highScore,
        HSDate: gm.StatsMan.highScoreDate,
        HSSwipesUp: gm.StatsMan.highScoreSwipeUp,
        HSSwipesDown: gm.StatsMan.highScoreSwipeDown,
        HSSwipesLeft: gm.StatsMan.highScoreSwipeLeft,
        HSSwipesRight: gm.StatsMan.highScoreSwipeRigh,
        HSUsername: user
    });
}

//Function to set the global stat totals
//Takes in the game manager
DBUtil.setGlobalStatsTotals = function(gm) {
    var post = {}
    gm.db.fb.database().ref("GlobalStats").once("value", function(ss){
        post["TotalSwipesDown"] = ss.val().TotalSwipesDown + gm.StatsMan.swipeDown;
        post["TotalSwipesRight"] = ss.val().TotalSwipesRight + gm.StatsMan.swipeRight;
        post["TotalSwipesLeft"] = ss.val().TotalSwipesLeft + gm.StatsMan.swipeLeft;
        post["TotalSwipesUp"] = ss.val().TotalSwipesUp + gm.StatsMan.swipeUp;
        DBUtil.updateGlobalStatsTotals(gm, post);
    });
    DBUtil.getGlobalStats(gm, "");
}

//Function to update the global stat totals
//Takes in the game manager and a JSON variable
DBUtil.updateGlobalStatsTotals = function(gm, post) {
    gm.db.fb.database().ref("GlobalStats").update(post);
}

//Function to get the Global Stats
//Takes in the game manager
DBUtil.getGlobalStats = function(gm, task) {
    var stats = gm.StatsMan;
    gm.db.fb.database().ref("GlobalStats").once("value", function(ss){
        stats.GloHSDate = ss.val().HSDate;
        stats.GloHSSwipesDown = ss.val().HSSwipesDown;
        stats.GloHSSwipesLeft = ss.val().HSSwipesLeft;
        stats.GloHSSwipesRight = ss.val().HSSwipesRight;
        stats.GloHSSwipesUp = ss.val().HSSwipesUp;
        stats.GloHSUsername = ss.val().HSUsername;
        stats.GloHighScore = ss.val().HighScore;
        stats.GloTotalSwipesDown = ss.val().TotalSwipesDown;
        stats.GloTotalSwipesLeft = ss.val().TotalSwipesLeft;
        stats.GloTotalSwipesRight = ss.val().TotalSwipesRight;
        stats.GloTotalSwipesUp = ss.val().TotalSwipesUp;
        stats.GloUserCount = ss.val().UserCount;


        if (task === "show") {
            gm.actuator.globallist();
            gm.StatsMan.showGlobalStats();
        }
    });
}

//Function to start the game invitation listener
//Takes in the game manager and a user
DBUtil.startGameInvitationListener = function(user, gm) {
    var userRef = gm.db.fb.database().ref("Users/" + user + "/GameInvitation");

    userRef.on("value", function(ss) {
        if (ss.val() !== 0 && gm.challengeGo !== true) {
            //User notification to accept or reject game invite
            //ONLY IF USER IS NOT ALREADY IN GAME
            gm.key = ss.val();
            gm.challengeGo = true;
            gm.db.fb.database().ref("Games/" + ss.val()).once("value", function(sss){
                sss.forEach(function (snap) {
                    if(snap.key !== user && snap.key !== "Status") {
                        gm.actuator.gameSentReceiving(snap.key);
                        gm.challengerName = snap.key;
                        return true;
                    }
                });
            });
        } else if (gm.challengeGo === true && ss.val() !== 0) {
            //Gets rid of popup notification
            gm.actuator.clearMessage();
        } else if (ss.val() === 0 && gm.over === true && gm.opponent === true) {
            var key1 = gm.key1;
            var opScore = 0;
            var userScore = 0;
            gm.db.fb.database().ref("Games/" + key1).on("value", function(snap2) {
                if (snap2.val().Status === "Done" && snap2.child(gm.challengerName).val() !== -1 && snap2.child(user).val() !== -1) {
                    opScore = snap2.child(gm.challengerName).val();
                    userScore = snap2.child(user).val();

                    var opponent = gm.challengerName;

                    if (opScore > userScore) {
                        gm.winner = "You (" + userScore + ") lost to " + opponent + " ("
                        + opScore + ") !";
                    } else if (userScore > opScore) {
                        gm.winner = "You (" + userScore + ") beat " + opponent + " ("
                        + opScore + ") !";
                    } else {
                        gm.winner = "You and " + opponent + " tied!";
                    }

                    gm.actuator.scoreMessage(gm.winner);
                    gm.challengeGo = false;

                    gm.db.fb.database().ref("Games/" + key1).update({
                        Status: "Completed"
                    });
                    gm.db.fb.database().ref("Games/" + key1).off();
                }
            });
        } else if(gm.challengeGo === true) {
            gm.challengeGo = false;
            //Gets rid of popup notification
            gm.actuator.okayMessage("Game Canceled!");
        }
    });
}

//Function to challenge an opponent
//Takes in the game manager, a user and an opponent
DBUtil.sendGameInvitation = function(user, opponent, gm) {
    gm.opponentName = opponent;

    var key = gm.key;

    gm.db.fb.database().ref("Games/" + key).off();

    gm.db.fb.database().ref("Games").once("value", function (ss){
        do {
            key = Math.floor(Math.random() * 999999999998) + 1;
        } while(ss.child(key).exists());

        gm.key = key;

        var post = {};
        post[user] = -1;
        post[opponent] = -1;
        post["Status"] = "Pending";
        gm.db.fb.database().ref("Games/" + key).update(post);

        gm.db.fb.database().ref("Users/" + opponent).update({
            GameInvitation: key
        });

        gm.actuator.gameSentWaiting(opponent);

        gm.challengeGo = true;

        gm.db.fb.database().ref("Games/" + key).on("value", function(sss) {
            if(sss.val().Status === "Started") {
                //Start Game
                gm.restart();
            } else if (sss.val().Status === "Completed") {
                var userVal = sss.child(user).val();
                var opponentVal = sss.child(opponent).val();
                DBUtil.updateWinLossTie(gm, user, userVal, opponent, opponentVal);
                gm.db.fb.database().ref("Games/" + key).off();
                gm.db.fb.database().ref("Games/" + key).set(null);
                gm.key = 0;
                //gm.challengeGo = false;
                gm.opponentName = "";
            } else if (sss.val().Status === "Rejected") {
                gm.db.fb.database().ref("Games/" + key).off();
                gm.db.fb.database().ref("Games/" + key).set(null);
                gm.key = 0;
                gm.actuator.okayMessage("Game Rejected!");
                gm.challengeGo = false;
                gm.opponentName = "";
            }
        });
    });
}

DBUtil.updateWinLossTie = function(gm, user, userVal, opponent, opponentVal) {
    //Calculations for win or lose or tie

    if(opponentVal > userVal) {
        //Opponent wins
        gm.db.fb.database().ref("Users").once("value", function(t) {
            var wins = t.child(opponent).val().Wins + 1;
            var losses = t.child(user).val().Losses + 1;

            var post = {};
            post[opponent + "/Wins"] = wins;
            post[user + "/Losses"] = losses;
            gm.db.fb.database().ref("Users").update(post);
        });

        gm.winner = "You (" + userVal + ") lost to " + opponent + " (" + opponentVal + ") !";
    } else if(userVal > opponentVal) {
        //User wins
        gm.db.fb.database().ref("Users").once("value", function(t) {
            var wins = t.child(user).val().Wins + 1;
            var losses = t.child(opponent).val().Losses + 1;

            var post = {};
            post[user + "/Wins"] = wins;
            post[opponent + "/Losses"] = losses;
            gm.db.fb.database().ref("Users").update(post);
        });
        gm.winner = "You (" + userVal + ") beat " + opponent + " (" + opponentVal + ") !";
    } else {
        //Tie
        gm.db.fb.database().ref("Users").once("value", function(t) {
            var ties1 = t.child(user).val().Ties + 1;
            var ties2 = t.child(opponent).val().Ties + 1;

            var post = {};
            post[user + "/Ties"] = ties1;
            post[opponent + "/Ties"] = ties2;
            gm.db.fb.database().ref("Users").update(post);
        });
        gm.winner = "You and " + opponent + " tied!";
    }
    gm.actuator.scoreMessage(gm.winner);
    gm.challengeGo = false;
}

//Function for cancelling/rejecting a game invite
DBUtil.cancelGameInvite = function(user, gm) {
    var key = gm.key;
    gm.db.fb.database().ref("Games/" + key).off();
    gm.db.fb.database().ref("Games/" + key).set(null);
    gm.key = 0;
    gm.challengeGo = false;
    gm.actuator.okayMessage("Game Canceled!");
    gm.db.fb.database().ref("Users/" + gm.opponentName).update({
        GameInvitation: 0
    });
    gm.opponentName = "";
}

//Function for rejecting a game invite
DBUtil.rejectGameInvite = function(user, gm) {
    var key = gm.key;
    gm.db.fb.database().ref("Games/" + key).update({
        Status: "Rejected"
    });
    gm.key = 0;
    gm.db.fb.database().ref("Users/" + user).update({
        GameInvitation: 0
    });
}

//Function for accepting a game invite
DBUtil.acceptGameInvite = function(gm) {
    var key = gm.key;
    gm.key1 = key;
    gm.db.fb.database().ref("Games/" + key).update({
        Status: "Started"
    });
    gm.opponent = true;

    //Start Game
    gm.restart();
}

//Function for updating the game score
DBUtil.sendGameScore = function(user, gm) {
    var post = {};
    post[user] = gm.score;
    var key = gm.key;
    gm.db.fb.database().ref("Games/" + key).once("value", function(ss){
        post["Status"] = "Done";
        gm.db.fb.database().ref("Games/" + key).update(post);
    });

    if(gm.opponent === true) {
        gm.db.fb.database().ref("Users/" + user).update({
            GameInvitation: 0
        });
        gm.key = 0;
    }

    gm.opponent = false;
}
