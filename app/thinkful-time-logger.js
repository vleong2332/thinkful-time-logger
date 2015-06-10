angular.module('thinkfulTimeLogger', ['firebase', 'timerComponent', 'dateComponent', 'notesComponent', 'questionsComponent', 'ghPushesComponent'])

.constant('FIREBASE_DB', 'https://thinkful-time-logger.firebaseio.com')

.run(function(FIREBASE_DB) {
   var ref = new Firebase(FIREBASE_DB);
})

.controller('rootCtrl', function($scope, $firebaseAuth, $firebaseObject, FIREBASE_DB, $timeout, timerData) {
   var ref = new Firebase(FIREBASE_DB);

   $scope.authObj  = $firebaseAuth(ref);
   $scope.authData = $scope.authObj.$getAuth();

   if ($scope.authData) {
      console.log('Already logged in as:', $scope.authData.uid);
   } else {
      console.log('Not logged in. Logging in now...');
      $scope.authObj.$authWithOAuthPopup('google').then(function (authData) {
         console.log('Logged in as:', authData.uid);
         $scope.loggedIn = true;
         $scope.authData = authData;
      }).catch(function(error) {
         console.error('Authetication failed: ', error);
      });
   }

   $scope.logSvcs = function() {
      console.log(timerData);
   }
})

;