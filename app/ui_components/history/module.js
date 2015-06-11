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
         var placeholder = 'Select a note, a question, or a push to view detail';
         $scope.history = $firebaseObject(ref);
         $scope.historyDetail = placeholder;
         $scope.isPlaceholder = true;

         $scope.expandNotes = function(notes) {
            if (notes) {
               $scope.historyDetail = notes;
               $scope.isPlaceholder = false;
            }
            else {
               $scope.historyDetail = placeholder;
               $scope.isPlaceholder = true;
            }
         };

         $scope.expandQuestions = function(questions) {
            if (questions) {
               var formatted = "";
               for (var i = 0; i < questions.length; i++) {
                  if (questions[i] != "") {
                     formatted += '<p>' + questions[i] + '</p>';
                  }
               }
               $scope.historyDetail = formatted;
               $scope.isPlaceholder = false;
            }
            else {
               $scope.historyDetail = placeholder;
               $scope.isPlaceholder = true;
            }
         };

         $scope.expandPushes = function(pushes) {
            console.log(pushes);
            if (pushes) {
               var formatted = "";
               for (var i = 0; i < pushes.length; i++) {
                  if (pushes[i] != "") {
                     formatted += '<p>' + pushes[i].payload.commits[0].message + '</p>';
                  }
               }
               $scope.historyDetail = formatted;
               $scope.isPlaceholder = false;
            }
            else {
               $scope.historyDetail = placeholder;
               $scope.isPlaceholder = true;
            }
         };
      }
   }
})

;