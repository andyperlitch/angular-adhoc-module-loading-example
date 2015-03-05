angular.module('othermodule', [])
.directive('testDir', function(blah) {
  return {
    link: function(scope, element) {
      console.log('linking testDir');
      console.log(blah);
      element.text('BLAM! mind blown.');
    }
  }
})
.factory('blah', function() {
  return {};
});