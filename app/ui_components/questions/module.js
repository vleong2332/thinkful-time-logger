angular.module('questionsComponent', ['textAngular'])

.directive('vlQuestions', function() {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      template: '<div id="questions-wrapper">' +
                '   <h1>Questions</h1>' +
                '   <div ng-repeat="question in data.questions track by $index">' +
                '     <div' +
                '      id="question{{ $index }}"' +
                '      class="question"' +
                '      contenteditable' +
                '      placeholder="Click to write down a question or concern"' +
                '      ng-enter="addQuestionBox($index)"' +
                '      ng-model="data.questions[$index]"' +
                '      ng-blur="deleteIfEmpty($index, $last, data.questions[$index].length)"' +
                '      ng-focus="updateFocusIndex($index)"' +
                '      force-focus="$index == focusIndex"></div>' +
                '   </div>' +
                '</div>',
      controller: function($scope, $element, $attrs) {
        $scope.focusIndex = 0;
        $scope.data = {
          questions: ['']
        };
      },
      link: function(scope, element, attrs) {
        // Called everytime user focus on one of the divs to keep track where the focus is.
        // This works mainly because ng-repeat re-orders the array numerically, even if something
        //    is inserted in the middle instead of the end or beginning.
        // $index/entryIndex gives us the exact location of the element being focused in the array.
        // Behavior: focusIndex will always give the exact location in the array of the current focus.
        scope.updateFocusIndex = function(entryIndex) {
          scope.focusIndex = entryIndex;
        };

        // Called when user leaves one of the divs.
        // Behavior: If the user leaves an empty div in the middle of the list, the entry will be deleted.
        scope.deleteIfEmpty = function (entryIndex, last, length) {
          if (!last && length == 0) {
            scope.data.questions.splice(entryIndex, 1);
          }
        };

        // Called when user presses "Enter" when focusing on one of the divs.
        // Behavior: If current div is empty, don't do anything.
        //    If the current div has a content and is the last on the list, add a new div at the end
        //    If the current div has a content and the next div is not empty, insert a new div between them
        //    If the current div has a content and the next div is there, but empty; switch focus to the next div
        scope.addQuestionBox = function(entryIndex) {
          var currentActive = document.activeElement;
          var nextElement   = currentActive.parentElement.nextElementSibling;
          var questions     = scope.data.questions;

          // If the box is not empty...
          if (currentActive.innerText.trim().length > 0) {
            // ...AND...
            // ...if the box is the last element...
            if (nextElement == null) {
              // Push a new element at the end
              questions.push('');
              scope.focusIndex += 1;
            }
            // ... or if the box is not the last element and the next box is not empty...
            else if (nextElement.firstElementChild.innerText.trim().length > 0) {
              // Insert a new box from there
              var index = entryIndex + 1;
              questions.splice(index, 0, '');
              scope.focusIndex = index;
            }
            // ... or if the box is not the last element and the next box is empty...
            else if(nextElement.firstElementChild.innerText.trim().length == 0) {
              nextElement.focus();
              scope.focusIndex += 1;
            }
            else {
              console.log('nothing happens');
            }
          }
        };
      }
   }
})

.directive('ngEnter', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('keydown keypress', function(event) {
        if (event.which == 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    }
  }
})

.directive('forceFocus', function() {
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {
      scope.$watch(function(){
        return scope.$eval(attrs.forceFocus);
      },function (newValue){
        if (newValue == true){
          element[0].focus();
          // use focus function instead of autofocus attribute to avoid cross browser problem.
          // And autofocus should only be used to mark an element to be focused when page loads.
        }
      });
    }
  }
})

.directive('contenteditable', function($sce) {
   return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
         if(!ngModel) return;

         function write() {
            var data = element.html();
            ngModel.$setViewValue(data);
         }

         ngModel.$render = function() {
            element.html($sce.getTrustedHtml(ngModel.$modelValue));
         };

         element.on('blur keydown keyup change', function() {
            scope.$evalAsync(write);
         });

         ngModel.$render();
      }     
   }
})

;