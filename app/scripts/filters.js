angular.module('uniAdmin.filters', [])
    .filter('fixLength', function() {
        return function(val, obj) {
            try {
                return val.substr(0, obj.item.meta.maxlength);
            } catch (e) {
                return val;
            }
        }
    })
    .filter('deepKey', function() {
        return function(val, obj) {
            return eval('val.' + obj.key);
        }
    });