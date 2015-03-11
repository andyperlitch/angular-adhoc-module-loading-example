angular.module('andyConfigUiExample', [])
// Adds another custom parameter to launchOptions.customParams
// called dt.application.Ingestion.operator.Reader.throughput.
// The user sets this value with the given <select>
.directive('configUiExample', function() {
  return {
    scope: {
      params: '=',
      type: '@'
    },
    template: '<div ng-if="throughputParam"><label>choose a throughput:</label>' +
              '<select ng-model="throughputParam.value" ng-options="choice for choice in throughputOptions">' +
              '<option value="">-- choose a throughput --</option>' +
              '</select></div><hr>' +
              '<div ng-if="dimParam"><label>choose dimension strings</label><br>' +
              '<select ng-repeat-start="dimChoice in dimChoices track by $index" type="text" ng-model="dimChoices[$index]" ng-options="dimOption for dimOption in dimOptions" required><option value="">-- choose a string --</option></select><br ng-repeat-end>' +
              '<button ng-click="addDimChoice()">add a string</button></div>'
              ,
    link: function(scope) {

      // THROUGHPUT STUFF
      if (scope.type === 'runtime') {
        scope.throughputOptions = [
          1,
          10,
          100,
          1000
        ];
        scope.throughputParam = {
          name: 'dt.application.Ingestion.operator.Reader.throughput'
        };
        scope.params.push(scope.throughputParam);
      }

      // DIMENSIONS
      // value format: string1|string2|string3|string4
      if (scope.type === 'launchtime') {
        scope.dimParam = {
          name: 'dt.application.Ingestion.operator.Dimensions.format'
        };
        scope.dimOptions = [
          'foo',
          'bar',
          'baz',
          'bat'
        ];
        scope.dimChoices = [];
        scope.addDimChoice = function() {
          scope.dimChoices.push('');
        };
        scope.$watch('dimChoices', function(choices) {
          scope.dimParam.value = choices.join('|');
        }, true);
        scope.params.push(scope.dimParam);
      }

      // Push parameters onto the launchOptions.customParams array
      
    }
  };
});