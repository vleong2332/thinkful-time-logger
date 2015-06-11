angular.module('historyComponent', ['firebase'])

//----------------------------------------------------

.constant('FIREBASE_DB', 'https://thinkful-time-logger.firebaseio.com')

//----------------------------------------------------

.directive('vlHistory', function(FIREBASE_DB, $firebaseObject) {
   return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: './ui_components/history/template.html',
      controller: function ($scope, $element, $attrs) {
         var ref = new Firebase(FIREBASE_DB);
         $scope.history = $firebaseObject(ref);
      }
   }
})

;