angular.module('uniAdmin.filters', [])
    .filter('fixLength', function() {
        return function(val, length) {
            return val.substr(0, length);
        }
    })
    .filter('deepKey', function() {
        return function(val, obj) {
            return eval('val.' + obj.key);
        }
    });