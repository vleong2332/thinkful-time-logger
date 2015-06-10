angular.module('ghPushesComponent', [])

.factory('getGithubPushes', function($rootScope, $http, $q) {
   return function(username) {
      console.log ('making request');
      var defer = $q.defer();
      $http({
         url: 'https://api.github.com/users/' + username + '/events',
         method: 'GET',
         cache: true
      })
         .success(function(data) {
            console.log('success', data);
            defer.resolve(data);
         })
         .error(function(data) {
            console.log('Unable to reach GitHub for events data');
         });
      return defer.promise;
   }
})

.directive('vlGhPushes', function(getGithubPushes) {
   return {
      restict: 'EA',
      replace: true,
      scope: true,
      template: '<div id="gh-pushes-wrapper">' +
                '   <div id="gh-pushes-head">' +
                '      <h1>GitHub Pushes</h1>' +
                '      <button id="refresh-button" ng-click="refresh()" ng-class="{refreshing: refreshing}"></button>' +
                '      <input name="gh-username" type="text" ng-model="ghUsername" placeholder="GitHub Username" />' +
                '   </div>' +
                '   <div id="gh-pushes-body">' +
                '      <div id="gh-pushes-error-message" class="message" ng-show="noData">Invalid username</div>' +
                '      <div id="gh-pushes-empty-message" class="message" ng-show="!ghUsername">Enter GitHub username to get data</div>' +
                '      <div class="gh-pushes-entry" ng-repeat="push in data.pushes">' +
                '         <p class="gh-pushes-message">' + 
                '            <a target="_blank" ng-href="https://github.com/{{ push.repo.name }}/commit/{{ push.payload.head }}">' + 
                '              {{ push.payload.commits[0].message }}' + 
                '            </a>' +
                '         </p>' +
                '         <p class="gh-pushes-time">{{ push.created_at | removeTZ }}</p>' +
                '      </div>' +
                '   </div>' +
                '</div>',
      controller: function($scope, $element, $attrs, getGithubPushes) {
         $scope.ghUsername = '';
      },
      link: function(scope, element, attrs) {
         var input = element.find('input')[0];
         var refreshInterval = 180000;

         function githubRequest(username) {
            getGithubPushes(username).then(function(result) {
               var cooked = [];

               angular.forEach(result, function(value, key) {
                  if (value.type == "PushEvent") { this.push(value); }
               }, cooked);

               scope.data = {
                  pushes: cooked
               };

               console.log(scope.data.pushes);

               if (scope.data.pushes.length == 0 && scope.ghUsername != "") { scope.noData = true; }
               else { scope.noData = false; }
            },
            function(error) {
               console.log(error);
               scope.refreshing = false;
            });
         }

         scope.refresh = function() { console.log('refresh'); githubRequest(scope.ghUsername); }

         githubRequest(scope.ghUsername);
         setInterval(function () { githubRequest(scope.ghUsername); }, refreshInterval);
         angular.element(input).on('blur keypress', function(event) {
            // Exit if keypress is not "Enter"
            if (event.type == "keypress" && event.which != 13) {
               console.log('exiting');
               return;
            }
            // Otherwise, if it's "Enter"...
            else {
               // Trim input's value
               input.value = input.value.trim();
               // If, after trimming, input is not empty...
               if (input.value != "") {
                  // Request push events from GitHub
                  githubRequest(scope.ghUsername);
               }
               // Blur from the input regardless
               input.blur();
            }
         });
      }
   }
})

.filter('removeTZ', function() {
   return function(input) {
      var result = input.replace('T', '   ');
      var result = result.replace('Z', '');
      return result;
   }
})

;