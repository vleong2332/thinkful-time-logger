angular.module('questionsComponent', ['textAngular'])

//------------------------------------

.factory('questionsData', function() {
   return { questions: [''] }
})

//------------------------------------

.directive('vlQuestions', function(questionsData) {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      templateUrl: './ui_components/questions/template.html',
      //
      controller: function($scope, $element, $attrs) {
         // Scope initialization
         $scope.focusIndex = 0;
         $scope.data = {
                          questions: ['']
                       };
         // Scope API
         $scope.updateFocusIndex = function(entryIndex) { $scope.focusIndex = entryIndex; };
         $scope.deleteIfEmpty = function (entryIndex, last, length) {
            if (!last && length == 0) $scope.data.questions.splice(entryIndex, 1);
         };
         $scope.addQuestionBox = function(entryIndex) {
            var currentActive = document.activeElement;
            var nextElement   = currentActive.parentElement.nextElementSibling;
            var questions     = $scope.data.questions;

            // If the box is not empty...
            if (currentActive.innerText.trim().length > 0) {
               if (nextElement == null) {
                  questions.push('');
                  $scope.focusIndex += 1;
               }
               else if (nextElement.firstElementChild.innerText.trim().length > 0) {
                  var index = entryIndex + 1;
                  questions.splice(index, 0, '');
                  $scope.focusIndex = index;
               }
               else if(nextElement.firstElementChild.innerText.trim().length == 0) {
                  nextElement.focus();
                  $scope.focusIndex += 1;
               }
            } // end of if
         }; // end of addQuestionBox()
      },
      link: function(scope) {
         // Event handler
         scope.$watchCollection('data.questions', function(newValue) {
            console.log('bug 1');
            questionsData.questions = newValue;
            console.log('bug 2', questionsData.questions);
            console.log('bug 3', newValue);
         });
      }
   } // end of return
}) // end of directive

//------------------------------------

.directive('ngEnter', function() {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         element.bind('keydown keypress', function(event) {
            if (event.which == 13) {
               scope.$apply(function () { scope.$eval(attrs.ngEnter); });
               event.preventDefault();
            }
         });
      }
   }
})

//------------------------------------

.directive('forceFocus', function() {
   return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
         scope.$watch(function(){
            return scope.$eval(attrs.forceFocus);
         },
         function (newValue){
            if (newValue == true){ element[0].focus(); }
            // use focus function instead of autofocus attribute to avoid cross browser problem.
            // And autofocus should only be used to mark an element to be focused when page loads.
         });
      }
   }
})

//------------------------------------

.directive('contenteditable', function($sce) {
   return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
         if(!ngModel) return;
   
         element.on('blur keydown keyup change', function() {
            scope.$evalAsync(write);
         });

         function write() {
            var data = element.html();
            ngModel.$setViewValue(data);
         }

         ngModel.$render = function() {
            element.html($sce.getTrustedHtml(ngModel.$modelValue));
         };

         ngModel.$render();
      }     
   }
})

;