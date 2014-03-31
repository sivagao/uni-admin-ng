angular.module('uniAdmin.filters', [])
    .filter('fixLength', function() {
        return function(val, length) {
            if (!val) return;
            if (_.isString(val)) {
                return val.substr(0, length);
            }
        }
    })
    .filter('deepKey', function() {
        return function(val, obj) {
            return eval('val.' + obj.key);
        }
    });