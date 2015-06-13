angular.module('notesComponent', ['textAngular'])

//---------------------------------------------

.factory('notesData', function() {
  return {
    htmlText: ''
  }
})

//---------------------------------------------

.config(function($provide) {
   $provide.decorator('taOptions', ['$delegate', function(taOptions){
      // $delegate is the taOptions we are decorating
      // here we override the default toolbars and classes specified in taOptions.
      taOptions.toolbar = [
         ['h1', 'h2', 'h3', 'h4', 'p', 'pre', 'quote'],
         ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
         ['justifyLeft','justifyCenter','justifyRight'],
         ['html', 'insertImage', 'insertLink']
      ];
      return taOptions; // whatever you return will be the taOptions
   }]);
})

//---------------------------------------------

.directive('vlNotes', function(notesData) {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      templateUrl: './ui_components/notes/template.html',
      controller: function($scope) {
         $scope.htmlVariable = "";
         $scope.$watch('htmlVariable', function(newValue) {
            notesData.htmlText = newValue;
         });
      }
   }
})

;