angular.module('timerComponent', [])

//------------------------------------

.factory('timerData', function() {
   return {
      totalTime: 0,
      details: []
   };
})

//------------------------------------

.directive('vlTimer', function(timerData) {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      templateUrl: './ui_components/timer/template.html',
      // 
      controller: function($scope, $element, $attrs) {
         // Scope initialization
         $scope.state       = 'initial';
         $scope.buttonText  = 'start';
         $scope.showConfirm = false;
         $scope.data        = {
                                 totalTime: 0,
                                 details: []
                              };
         // Scope API
         $scope.toggleConfirm = function() {
                                   $scope.showConfirm = !$scope.showConfirm;
                                };
      },
      //
      link: function(scope, element, attrs) {
         // Private variables
         var time, startTime, stopTime, intervalId, timeoutId;
         var interval = 1000;
         var remTime  = interval;

         // Private functions
         function timerOneUp() {
            scope.data.totalTime += 1;
            scope.$apply();
            remTime = interval;
         }
         function clearTimerIds() {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
         }
         function changeState (state, text) {
            scope.state      = state;
            scope.buttonText = text;
         }

         // Public functions
         scope.reset = function() {
            changeState('initial', 'start');
            clearTimerIds();
            scope.data.totalTime = 0;
         };
         scope.toggleStart = function() {
            // INITIAL to RUN state
            if (scope.state === 'initial') {
               changeState('running', 'pause');
               intervalId = setInterval(function() { timerOneUp(); }, interval);
               startTime = Date.now();
            }
            // RUN to PAUSE state
            else if (scope.state === 'running' || scope.state === 'resumed') {
               changeState('paused', 'resume');
               clearTimerIds();
               stopTime = Date.now();
               remTime = remTime - ((stopTime - startTime) % interval);
               scope.data.details.push({
                  start: startTime,
                  stop:  stopTime,
               });
            }
            // PAUSE to RESUMED state
            else if (scope.state === 'paused') {
               changeState('resumed', 'pause');
               timeoutId = setTimeout(function() {
                  timerOneUp();
                  intervalId = setInterval(function() { timerOneUp(); }, interval);
               }, remTime);
               startTime = Date.now();
            }
         }; // end of toggleStart()

         // Event handler
         scope.$watchCollection('data', function(newValue) {
            timerData.totalTime = newValue.totalTime;
            timerData.details   = newValue.details;
         });
      } // end of link
   } // end of return
}) // end of directive

//------------------------------------

.directive('timerResetConfirm', function() {
   return {
      require: '^vlTimer',
      restrict: 'EA',
      replace: true,
      scope: true,
      template: '<div id="timer-reset-confirm">' +
                '   <p>Reset timer?</p>' +
                '   <button id="timer-reset-yes" reset="reset" ng-click="reset(); toggleConfirm();">Yes</button>' +
                '   <button id="timer-reset-no" ng-click="toggleConfirm()">No</button>' +
                '</div>'
   }
}) // end of directive

//------------------------------------

.filter('time', function() {
   return function(input) {
      var input = input || '00';
      var ss = parseInt(input % 60);
      var mm = parseInt((input / 60) % 60);
      var hh = parseInt((input / 3600) % 24);

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

      return  pad(hh, 2) + ':' + pad(mm, 2) + ':' + pad(ss, 2);
   }
}) // end of filter

; // end of module