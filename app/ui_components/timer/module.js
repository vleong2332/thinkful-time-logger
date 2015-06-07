angular.module('timerComponent', [])

.directive('vlTimer', function() {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      template: '<div id="timer-container">' +
                '   <div id="timer-time">{{ data.totalTime | time }}</div>' +
                '   <button id="timer-button" ng-click="toggleStart()">{{ buttonText | uppercase}}</button>' +
                '   <button id="timer-reset" ng-click="toggleConfirm()"></button>' +
                '   <timer-reset-confirm ng-show="showConfirm"></timer-reset-confirm>' +
                '</div>',
      //  
      controller: function($scope, $element, $attrs) {
         $scope.state = 'initial';
         $scope.buttonText = 'start';
         $scope.showConfirm = false;
         $scope.data = {
            totalTime: 0,
            details: []
         }
         //
         $scope.toggleConfirm = function() {
            $scope.showConfirm = !$scope.showConfirm;
         }
      },
      link: function(scope, element, attrs) {
         var time, startTime, stopTime, intervalId, timeoutId;
         var interval = 1000;
         var remTime  = interval;
         //
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
         //
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
         };
      }
   }
})

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
                '</div>',
   }
})

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
})

;