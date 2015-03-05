angular.module('badmodule', [])
.directive('existingDir', function() {
  return {
    link: function(scope, element) {
      console.log('should not be seeing this...');
    }
  }
});