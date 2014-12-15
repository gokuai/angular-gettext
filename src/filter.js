angular.module('gettext').filter('translate', [
  'gettextCatalog',
  '$interpolate',
  '$parse',
  function (gettextCatalog, $interpolate, $parse) {
    return function (input) {
       return gettextCatalog.getString(input);
    };
  }
]);