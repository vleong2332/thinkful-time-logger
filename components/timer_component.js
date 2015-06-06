angular.module('timerComponent', [])

.directive('vlTimer', function() {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      template: '<div id="timer-container">' +
                ' <div id="timer-time">{{ timer }}</div>' +
                ' <button id="timer-button" ng-click="toggle()">{{ buttonText | uppercase}}</button>' +
                ' <button id="timer-refresh" ng-click="reset()">RESET</button>' +
                '</div>',
      //   
      link: function(scope, element, attrs) {
         var time, startTime, stopTime, intervalId, timeoutId;
         var interval = 1000;
         var remTime  = interval;
         //
         function timerOneUp() {
            scope.timer += 1;
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
         scope.timer = 0;
         scope.state = 'initial';
         scope.buttonText = 'start';
         //
         scope.toggle = function() {
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
         //
         scope.reset = function() {
            changeState('initial', 'start');
            clearTimerIds();
            scope.timer = 0;
         };
      }
   }
})

;