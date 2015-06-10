angular.module('dateComponent', [])

//------------------------------------

.factory('dateData', function() {
   console.log('service is invoked');
   return {
      date: ''
   };
})



//------------------------------------

.directive('vlDate', function(dateData) {
   return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: './ui_components/date/template.html',
      //
      controller: function($scope, $element, $attrs) {
         // Scope initialization
         $scope.changePanelView = false;

         // Scope API
         $scope.toggleChangePanel = function() {
                                       $scope.changePanelView = !$scope.changePanelView;
                                    }
      },
      //
      link: function(scope, element, attrs) {
         // Private variables
         var d = new Date();
         var dd = d.getDate();
         var mm = d.getMonth() + 1;
         var yy = d.getFullYear();
         var today = yy + '-' + pad(mm) +'-' + pad(dd);


         // Private functions
         function pad(number, thickness) {
            var number    = number    || 0;
            var thickness = thickness || 2;
            var padNeeded = thickness - number.toString().length;
            var pad = '';
            for (var i = 0; i < padNeeded; i++) {
               pad += '0';
            }
            return pad + number;
         }

         // Public variables
         scope.data = {
                         date: today
                      };

         // Event handler
         scope.$watchCollection('data', function(newValue) {
            console.log('watched');
            dateData.date = newValue.date;
         });
         
      } // end of link
   } // end of return
}) // end of directive

//------------------------------------


.directive('vlDateChange', function() {
   return {
      restrict: 'EA',
      replace: true,
      scope: true,
      templateUrl: './ui_components/date/date_change_templ.html',
      controller: function($scope, $element, $attrs) {
         $scope.changeDate = function() {
            $scope.data.date = $element.find('input')[0].value;
         };
      }
   }
}) // end of directive

; // end of module