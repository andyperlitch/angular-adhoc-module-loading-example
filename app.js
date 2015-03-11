angular.module('app', ['angularLoad', 'scs.couch-potato'])

// Load the couchPotato provider
.config(function($couchPotatoProvider) {
  console.log($couchPotatoProvider);
})

// Dummy directive to test name clashes
.directive('existingDir', function() {
  return {};
})

// Main app controller for this example
.controller('MainAppCtrl', function($scope, $http, angularLoad, $couchPotato, $element, $compile, $injector) {

  // Holds information that will be used
  // when launching the application
  $scope.launchOptions = {

    // Will be set to true by user if they want
    // to use a config file
    usingConfigFile: false,

    // The config file to use
    configFile: '',

    // Will be set to true by user if they want
    // to specify custom parameters
    usingCustomParams: false,

    // The custom parameters to launch with.
    // Start with one for first value.
    customParams: [{}],

    // Will be set to true if the user wants to
    // save the entered parameters as a config
    // file for later use.
    saveConfig: false,

    // The name of the saved config file
    configFileName: ''

  };

  // Place where the loaded directive will go
  var $trg = $element.find('#target');

  // Creates an element,
  // adds the passed directive to it,
  // compiles it,
  // then inserts it into the target element
  $scope.compileTarget = function(directiveName) {
    var attrString = _.kebabCase(directiveName); // convertsThisString => converts-this-string
    var markup = '<div ' + attrString + ' params="launchOptions.customParams" type="runtime"></div>';
    var element = angular.element(markup);
    var element = $compile(element)($scope);
    $trg.append(element);
  };

  // Checks whether a service (or directive) name
  // clashes with any currently-loaded services (or directives)
  $scope.isSafeName = function(name, type) {
    if (type === 'directive') {
      name += 'Directive';
    }
    return !$injector.has(name);
  };

  // Given a base path that is assumed to be a folder
  // accessible from /, loads a package.json file, then
  // its main script. Then, it loads the components of
  // that module into this app, making them available for
  // use after this is called.
  $scope.loadModule = function(path) {

    // get the package.json of module to load
    $http.get( path + '/package.json').then(function(response) {

      var packageJson = response.data;

      // load the main script
      // NOTE: does not take into account a "main" that is array
      angularLoad.loadScript( path + '/' + packageJson.main).then(function() {

        // Get the components in the module (services, directives, etc)
        var queue = angular.module(packageJson.moduleName)._invokeQueue;

        // Loop through components, check if there are no name clashes (before loading them)
        queue.forEach(function(component) {
          // component looks like this: ['$compileProvider', 'directive', ['myDirectiveName', directiveFactoryFn] ]
          var componentType = component[1];
          var componentName = component[2][0];
          if (!$scope.isSafeName(componentName, componentType)) {
            throw new Error('The module that you are trying to load has a service named "' + componentName + '" that is already in this app!');
          }
        });

        // If we made it here, we can go ahead and load the components
        queue.forEach(function(component) {
          var componentType = component[1];
          var componentArguments = component[2];
          // Assemble the registerXXX method name for this component
          var couchPotatoMethod = _.camelCase('register ' + componentType);
          // Use couchPotato to add it to our module
          $couchPotato[couchPotatoMethod](componentArguments);
        })

        // All is well, compile our directive!
        $scope.compileTarget(packageJson.directiveName);
      });
    });
  };
})