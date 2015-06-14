angular.module('historyComponent', ['firebase'])

//----------------------------------------------------

.constant('FIREBASE_DB', 'https://thinkful-time-logger.firebaseio.com')

//----------------------------------------------------

.factory('historyData', function() {
   return {
      lastGHUsername: ''
   }
})

//----------------------------------------------------

.directive('vlHistory', function(FIREBASE_DB, $firebaseObject, $firebaseAuth, historyData) {
   return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: './ui_components/history/template.html',
      controller: function ($scope, $element, $attrs) {
         var placeholder = 'Select a note, a question, or a push to view detail';
         var ref = new Firebase(FIREBASE_DB);
         var authObj  = $firebaseAuth(ref);
         var authData = authObj.$getAuth();

         $scope.history  = $firebaseObject(ref);
         $scope.unwatch = $scope.history.$watch(function() {
            $scope.history = $scope.userHistory($scope.history);
            historyData.lastGHUsername = $scope.history[0].entry.user.gh;
            $scope.unwatch();
         });
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

         $scope.userHistory = function (object) {
            var array = [];
            angular.forEach(object, function(value, key) {
               if (value.entry.user.uid == authData.uid) {
                  array.push(value);
               }
            });
            if (array.length) {
               array.sort(function(a, b) {
                  return b.entry.date.logged.localeCompare(a.entry.date.logged);;
               });
            }
            return array;
         }; // end of userHistory()

      } // end of controller
   }; // end of return
}) // end of directive

//----------------------------------------------------

.filter('lengthOfTime', function() {
   return function(seconds) {
      var input = seconds || 0;
      var hh = Math.round((input / 3600) % 99);
      var mm = Math.round((input / 60) % 60);
      
      var output = '';
      if (hh) { output += hh + 'h '; }
      output += mm + 'm';
      
      return output;
   };
})

//----------------------------------------------------

.filter('noHTMLTags', function() {
   return function(text) {
      return text.replace(/<[\/]?[a-z0-9\=\:\"\;\(\)\,]*[\/]?>/ig, '');
   };
})

;