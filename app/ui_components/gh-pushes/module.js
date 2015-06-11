angular.module('ghPushesComponent', [])

//-------------------------------------

.factory('ghPushesData', function() {
   return {
      pushes: []
   }
})

//-------------------------------------

.constant('GITHUB_API', 'https://api.github.com/')

//-------------------------------------

.factory('getGithubPushes', function($http, $q, GITHUB_API) {
   return function(username) {
      var defer = $q.defer();
      $http({
         url: GITHUB_API + 'users/' + username + '/events',
         method: 'GET',
      })
      .success(function(data) {
         defer.resolve(data);
      })
      .error(function(data) {
         console.log('Unable to reach GitHub for events data', data);
      });
      return defer.promise;
   }
})

//-------------------------------------

.directive('vlGhPushes', function(getGithubPushes, ghPushesData) {
   return {
      restict: 'EA',
      replace: true,
      scope: true,
      templateUrl: './ui_components/gh-pushes/template.html',
      controller: function($scope, $element, $attrs) {
         $scope.ghUsername = '';
         $scope.data = { pushes: [] };
         $scope.noData = false;
         $scope.refreshing = false;
      },
      link: function(scope, element, attrs) {
         // Private variables
         var input = element.find('input')[0];
         var refreshInterval = 60000;
         var recentPushes = 10;

         // Private functions
         function githubRequest(username) {
            scope.refreshing = true;
            getGithubPushes(username)
            .then(function(result) {
               // Only keep the push events
               var pushEvents = [];
               angular.forEach(result, function(value, key) {
                  if (value.type == "PushEvent") { this.push(value); }
               }, pushEvents);

               // Refresh the object
               scope.data = {}; // Do I need this? See if refresh works as expected without this
               scope.data.pushes = pushEvents;

               // Flag to see if there's any push events: this is used in template.
               if (scope.data.pushes.length == 0 && scope.ghUsername != "") { scope.noData = true; }
               else { scope.noData = false; }

               scope.refreshing = false;
            },
            function(error) { // Is this second function necessary in then()?
               console.log(error);
               scope.refreshing = false;
            });
         }

         // ng-click on refresh button will trigger this.
         scope.refresh = function() { githubRequest(scope.ghUsername); }
         // ^--- If username can be passed from template, I can call the inner function directly 

         // Initial and subsequent requests
         if (scope.ghUsername) githubRequest(scope.ghUsername);
         setInterval(function () { if(scope.ghUsername) githubRequest(scope.ghUsername); }, refreshInterval);

         // Bind event handlers to the github username input
         angular.element(input).on('blur keypress', function(event) {
            if (event.type == "keypress" && event.which != 13) {
               return;
            }
            else {
               input.value = input.value.trim();
               if (input.value) {
                  githubRequest(scope.ghUsername);
               }
               input.blur();
            }
         });

         // Only push the last 10 pushes to the main app
         scope.$watchCollection('data.pushes', function(newValue) {
            for (var i = 0; i < newValue.length && i < recentPushes; i++) {
               ghPushesData.pushes[i] = newValue[i];
            }
         });

      } // end of link
   } // end of return
}) // end of directive

//-------------------------------------

.filter('removeTZ', function() {
   return function(input) {
      var result = input.replace('T', ' - ');
      var result = result.replace('Z', '');
      return result;
   }
})

; // end of module