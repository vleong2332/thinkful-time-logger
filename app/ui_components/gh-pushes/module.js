angular.module('ghPushesComponent', [])

.constant('GITHUB_API', 'https://api.github.com/')

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

.directive('vlGhPushes', function(getGithubPushes) {
   return {
      restict: 'EA',
      replace: true,
      scope: true,
      templateUrl: './ui_components/gh-pushes/template.html',
      controller: function($scope, $element, $attrs, getGithubPushes) {
         $scope.ghUsername = '';
      },
      link: function(scope, element, attrs) {
         // Variable declarations
         var input = element.find('input')[0];
         var refreshInterval = 60000;
         // Function declaration
         function githubRequest(username) {
            getGithubPushes(username)
            .then(function(result) {
               // Keep only the push events
               var pushEvents = [];
               angular.forEach(result, function(value, key) {
                  if (value.type == "PushEvent") { this.push(value); }
               }, pushEvents);

               // Refresh the object
               scope.data = {}; // Do I need this? See if refresh works as expected without this
               scope.data = { pushes: pushEvents };

               // Flag to see if there's any push events; is used in template.
               if (scope.data.pushes.length == 0 && scope.ghUsername != "") { scope.noData = true; }
               else { scope.noData = false; }
            },
            function(error) { // Is this second function necessary in then()?
               console.log(error);
               scope.refreshing = false;
            });
         }

         // ng-click on refresh button will trigger this.
         scope.refresh = function() { githubRequest(scope.ghUsername); }
         // ^--- If username can be passed from template, I can call the inner function directly 

         // Initial request
         if (scope.ghUsername) githubRequest(scope.ghUsername);

         // Subsequent requests
         setInterval(function () { if(scope.ghUsername) githubRequest(scope.ghUsername); }, refreshInterval);

         // Bind event handlers to the github username input
         angular.element(input).on('blur keypress', function(event) {
            // Exit if keypress is not "Enter"
            if (event.type == "keypress" && event.which != 13) {
               return;
            }
            // Otherwise, if it's "Enter"...
            else {
               // If, after trimming, input is not empty...
               input.value = input.value.trim();
               if (input.value) {
                  githubRequest(scope.ghUsername);
               }
               // Blur from the input regardless
               input.blur();
            }
         }); // end of on()
      } // end of link
   } // end of return
}) // end of directive

.filter('removeTZ', function() {
   return function(input) {
      var result = input.replace('T', ' - ');
      var result = result.replace('Z', '');
      return result;
   }
})

;