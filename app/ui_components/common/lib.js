angular.module('vlLib', function() {})

.factory('padTime', function() {
   return function(a, b) {
      var number    = a || 0;
      var thickness = b || 2;
      var padNeeded = thickness - number.toString().length;
      var pad = '';
      for (var i = 0; i < padNeeded; i++) {
         pad += '0';
      }
      return pad + number;
   };
})

;