angular.module('thinkfulTimeLogger', ['timerComponent', 'dateComponent'])
.controller('defaultCtrl', function($scope) {
   console.log($scope);
})