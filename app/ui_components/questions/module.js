angular.module('notesComponent', ['textAngular'])

.directive('vlNotes', function() {
   return {
      restict: 'EA',
      replace: true,
      scope: {},
      template: '<div id="questions-wrapper">' +
                '   <h1>Questions</h1>' +
                '   <ul>' +
                '    <li></li>' +
                '   <ul>' +
                '</div>'
   }
})

;