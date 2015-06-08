angular.module('thinkfulTimeLogger', ['timerComponent', 'dateComponent', 'notesComponent', 'questionsComponent'])
.controller('defaultCtrl', function($scope) {
   console.log($scope);
})