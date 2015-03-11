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
    template: '<label>choose a throughput:</label><select ng-model="throughputParam.value" ng-options="choice as choice for choice in throughputOptions"><option value="">-- choose a throughput --</option></select>',
    link: function(scope) {
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
  };
});