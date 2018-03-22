function DBHandler() {


     // Initialize Firebase
      var config = {
        apiKey: "AIzaSyC0Vfv2hqUJmefYWwyDASrvq7sX0JaAUOw",
        authDomain: "cis3760-1c002.firebaseapp.com",
        databaseURL: "https://cis3760-1c002.firebaseio.com",
        storageBucket: "cis3760-1c002.appspot.com",
        messagingSenderId: "1056492587558"
      };

      this.fb = firebase.initializeApp(config);
      /*firebase.initializeApp(config);
      console.log(firebase);
      this.testWrite('uid', 'username', 'picture', 'title', 'body');*/

}

/*DBHandler.prototype.testWrite = function (uid, username, picture, title, body) {

    var testRef = firebase.database().ref('test');
    testRef.set({
       John: {
          number: 1,
          age: 9001,
          message:"Works on my mac"
       },

       Amanda: {
          number: 2,
          age: 20
       }
    });

}*/