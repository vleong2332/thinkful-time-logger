angular.module('thinkfulTimeLogger', ['firebase', 'timerComponent', 'dateComponent', 'notesComponent', 'questionsComponent', 'ghPushesComponent', 'historyComponent'])

//--------------------------------------------------

.constant('FIREBASE_DB', 'https://thinkful-time-logger.firebaseio.com')

//--------------------------------------------------

.controller('rootCtrl', function($scope, $firebaseAuth, $firebaseObject, FIREBASE_DB, timerData, dateData, notesData, questionsData, ghPushesData) {
   var ref = new Firebase(FIREBASE_DB);

   $scope.debug    = true;
   $scope.authObj  = $firebaseAuth(ref);
   $scope.authData = $scope.authObj.$getAuth();
   $scope.dbSave = {
      success: false,
      error: false
   }
   // $scope.history = $firebaseObject(ref);

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
      // Preparing spot in database
      var entry = ref.push();
      var db = $firebaseObject(entry);

      // Object construction
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

      // Save object into database
      db.$save()
      .then(function (entry) {
            console.log(entry.key() == db.$id);
            $scope.dbSaveSuccess = true;
         },
         function(error) {
            console.log('Error saving to database:', error);
            $scope.dbSaveError = true;
         }
      );
   }
})

;