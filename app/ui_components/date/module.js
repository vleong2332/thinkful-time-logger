angular.module('dateComponent', [])

.directive('vlDate', function() {
   return {
      restrict: 'EA',
      replace: true,
      scope: {},
      template: '<div id="date-container">' +
                '   <p>Today is <span id="date" ng-click="toggleChangePanel()" ng-class="{changing: changePanelView}">{{ data.date | date: fullDate }}</span></p>' +
                '   <vl-date-change ng-show="changePanelView"></vl-date-change>' +
                '</div>',
      controller: function($scope, $element, $attrs) {
         $scope.changePanelView = false;
         $scope.toggleChangePanel = function() {
            $scope.changePanelView = !$scope.changePanelView;
         }
      },
      link: function(scope, element, attrs) {
         var d = new Date();
         var dd = d.getDate();
         var mm = d.getMonth() + 1;
         var yy = d.getFullYear();
         var today = yy + '-' + pad(mm) +'-' + pad(dd);
         //
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
         //
         scope.data = {
            date: today
         };
      }
   }
})

.directive('vlDateChange', function() {
   return {
      restrict: 'EA',
      replace: true,
      scope: true,
      template: '<div id="change-date-container">' +
                '   <p>Change to </p>' +
                '   <input name="new-date" type="date" value="{{ data.date }}" />' +
                '   <button id="change-date-yes" reset="reset" ng-click="changeDate(); toggleChangePanel();">Yes</button>' +
                '   <button id="change-date-no" ng-click="toggleChangePanel()">No</button>' +
                '</div>',
      controller: function($scope, $element, $attrs) {
         $scope.changeDate = function() {
            $scope.data.date = $element.find('input')[0].value;
         };
      }
   }
})

;