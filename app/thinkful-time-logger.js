angular.module('thinkfulTimeLogger', ['firebase', 'timerComponent', 'dateComponent', 'notesComponent', 'questionsComponent', 'ghPushesComponent'])

//--------------------------------------------------

.constant('FIREBASE_DB', 'https://thinkful-time-logger.firebaseio.com')

//--------------------------------------------------

.controller('rootCtrl', function($scope, $firebaseAuth, $firebaseObject, $firebaseArray, FIREBASE_DB, timerData, dateData, notesData, questionsData, ghPushesData) {
   var ref = new Firebase(FIREBASE_DB);

   $scope.debug    = true;
   $scope.authObj  = $firebaseAuth(ref);
   $scope.authData = $scope.authObj.$getAuth();
   $scope.history = $firebaseObject(ref);

   if ($scope.authData) {
      console.log('Already logged in as:', $scope.authData.uid);
   } else {
      console.log('Not logged in. Logging in now...');
      $scope.authObj.$authWithOAuthPopup('google')
      .then(function (authData) {
         console.log('Logged in as:', authData.uid);
         $scope.loggedIn = true;
         $scope.authData = authData;
      })
      .catch(function(error) {
         console.error('Authetication failed: ', error);
      });
   }

   $scope.recAndEndSession = function() {
      var entry = ref.push();
      var db = $firebaseObject(entry);
      db.entry = {
         id       : $scope.authData.uid + Date.now(),
         user     : {
                       uid        : $scope.authData.uid,
                       displayName: $scope.authData.google.displayName
                    },
         date     : {
                       logged : dateData.date,
                       entered: Date.now()
                    },
         time     : timerData,
         notes    : notesData.htmlText,
         questions: questionsData.questions,
         pushes   : ghPushesData.pushes
      };
      db.$save()
      .then(function (entry) {
            console.log(entry.key() == db.$id);
         },
         function(error) {
            console.log('Error saving to database:', error);
         }
      );
   }
})

;