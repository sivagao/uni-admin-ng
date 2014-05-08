// Render module for formly to display forms
angular.module('formly.render', []);
// Main Formly Module
angular.module('formly', ['formly.render']);
'use strict';
angular.module('formly.render').directive('formlyField', [
    '$http',
    '$compile',
    '$templateCache',
    function formlyField($http, $compile, $templateCache) {
        var getTemplateUrl = function(type) {
            var templateUrl = '/views/form/formly-field.html';
            return templateUrl;
        };
        return {
            restrict: 'AE',
            replace: true,
            scope: false,
            link: function fieldLink($scope, $element, $attr) {
                $scope.options = $scope.$eval($attr.options);
                if ($scope.options.referTpl) {
                    $element.html(document.querySelector($scope.options.referTpl).innerHTML);
                    $compile($element.contents())($scope);
                    return;
                }
                var templateUrl = getTemplateUrl($scope.options.type);
                var $input, $msg;
                if (templateUrl) {
                    $http.get(templateUrl, {
                        cache: $templateCache
                    }).success(function(data) {
                        //template data returned
                        $element.html(data);
                        $input = $element.find($scope.options.type)[0] ? $element.find($scope.options.type)[0] : $element.find('input')[0];
                        $msg = $element.find('div')[1];
                        $input.setAttribute('ng-model', $scope.$parent.options.key + '.' + $scope.options.key);
                        $input.setAttribute('name', $scope.options.key);
                        if ($input && $scope.options.validate) {
                            angular.forEach($scope.options.validate, function(val, key) {
                                $input.setAttribute('ng-' + key, val);
                            });
                        }
                        if ($msg && $scope.options.msg) {
                            angular.forEach($scope.options.msg, function(val, key) {
                                $msg.setAttribute(key, val);
                            });
                        }
                        if ($input && $scope.options.attr) {
                            angular.forEach($scope.options.attr, function(val, key) {
                                $input.setAttribute(key, val);
                            });
                        }
                        $compile($element.contents())($scope);
                    });
                } else {
                    console.log('Formly Error: template type \'' + $scope.options.type + '\' not supported.');
                }
            },
            controller: [
                '$scope',
                function fieldController($scope) {
                    return;
                    $scope.options = $scope.optionsData();
                    if ($scope.options.
                        default) {
                        $scope.value = $scope.options.
                        default;
                    }
                    // set field id to link labels and fields
                    $scope.id = $scope.options.key;
                }
            ]
        };
    }
]);
'use strict';
angular.module('formly.render').directive('formlyForm', [
    '$compile',
    function formlyForm($compile) {
        return {
            restrict: 'AE',
            templateUrl: '/views/form/formly-form.html',
            replace: true,
            scope: true,
            link: function($scope, $elem, $attr) {
                $scope.options = $scope.$eval($attr.options);
                $scope.fields = $scope.$eval($attr.fields);
                $scope.$parent[$scope.options.key] = {};
                // $elem[0].setAttribute('name', $scope.options.key);
                $compile($elem.contents())($scope);
            }
        };
    }
]);
// angular.module('formly.render').run([
//     '$templateCache',
//     function($templateCache) {
//         'use strict';
//         $templateCache.put('directives/formly-field.html', '<div inputfield="" labeltext={{options.label}} labelfor={{options.key}} ng-switch="" on=options.type>{{options.required ? \'*\' : \'\'}}<input ng-switch-default="" type="{{options.type || \'text\'}}" class=pmt-form-width-large id={{options.key}}><select ng-options="opt.name for opt in options.options" ng-switch-when=select><option value="" ng-if=options.nullText>-- {{options.nullText}} --</option></select><textarea ng-switch-when=textarea></textarea><div message="" for={{options.key}}></div></div>');
//         $templateCache.put('directives/formly-form.html', '<form class="formly pmt-form pmt-form-horizontal" novalidate><formly-field ng-repeat="field in fields" options=field class=formly-field></formly-field><button type=submit ng-hide=options.hideSubmit ng-click=populateResult()>{{options.submitCopy || "Submit"}}</button></form>');
//     }
// ]);


// fix - terrible!!

angular.module('formly.render').directive('message', [

    function() {
        function getFieldValidationExpr(formName, fieldName) {
            var fieldExpression = formName + '.' + fieldName;
            var invalidExpression = fieldExpression + '.$invalid';
            var dirtyExpression = fieldExpression + '.$dirty';
            var watchExpression = invalidExpression + ' && ' + dirtyExpression;
            return watchExpression;
        }

        function getFieldErrorExpr(formName, fieldName) {
            var fieldExpression = formName + '.' + fieldName;
            var errorExpression = fieldExpression + '.$error';
            return errorExpression;
        }

        function getFieldValueChangeExpr(formName, fieldName) {
            return formName + '.' + fieldName + '.$viewValue';
        }

        function getFieldCustErrExpr(formName, fieldName) {
            return formName + '.' + fieldName + '._custMsg';
        }
        var msgTable = {
            'required': '不能为空',
            'minlength': '长度过短',
            'maxlength': '长度过长',
            'email': '不是合法的email'
        };

        return {
            restrict: 'A',
            require: '^form',
            replace: true,
            template: '<div class="pmt-form-help-block"></div>',
            link: function($scope, el, attrs, ctrler) {
                var formName = ctrler.$name;
                var fieldName = attrs['for'];
                var watchExpr1 = getFieldValidationExpr(formName, fieldName);
                var watchExpr2 = getFieldErrorExpr(formName, fieldName);
                var watchValChangeExpr = getFieldValueChangeExpr(formName, fieldName);
                var watchCustErrExpr = getFieldCustErrExpr(formName, fieldName);

                var field = $scope[formName][fieldName];
                if (field) {
                    $scope[formName][fieldName]._checkShowMsg = checkShowMsg;
                }

                function checkShowMsg() {
                    var field = $scope[formName][fieldName];
                    var errShow, custMsg;
                    if (field) {
                        errShow = field.$invalid && field.$dirty;
                        if (field && field._custMsg) {
                            custMsg = field._custMsg;
                        }
                    }

                    var html, helpstr;
                    // if (errShow) {
                    //     el.parents('.pmt-form-row').find('label').addClass('w-text-warning');
                    // } else {
                    //     el.parents('.pmt-form-row').find('label').removeClass('w-text-warning');
                    // }
                    if (errShow || custMsg) {
                        var errors = field.$error;
                        var errmsg;
                        for (var error in errors) {
                            if (errors[error] && errors.hasOwnProperty(error)) {
                                if (errors[error] && attrs[error]) {
                                    errmsg = attrs[error];
                                } else if (error === 'required' && attrs.xrequired) {
                                    errmsg = attrs.xrequired;
                                } else if (errors[error] && msgTable[error]) {
                                    errmsg = msgTable[error];
                                } else {
                                    errmsg = attrs.validation;
                                }
                                if (!errmsg) {
                                    errmsg = '请填写正确的信息';
                                }
                            }
                        }
                        if (custMsg) {
                            errmsg = custMsg;
                        }
                        helpstr = attrs.help || '';
                        html = helpstr + '<span class="pmt-form-help-inline w-text-warning">' + errmsg + '</span>';
                    } else {
                        html = attrs.help || '';
                    }
                    // html && angular.element(el).html(html);
                    angular.element(el).html(html);
                }
                $scope.$watch(watchExpr2, checkShowMsg, true);
                $scope.$watch(watchExpr1, checkShowMsg, true);
                $scope.$watch(watchCustErrExpr, checkShowMsg, true);
                $scope.$watch(watchValChangeExpr, function() {
                    var field = $scope[formName][fieldName];
                    if (field && field._custMsg) {
                        delete field._custMsg;
                    }
                });
            }
        };
    }
]);
angular.module('formly.render').directive('inputfield', [

    function() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            require: 'ngModel',
            scope: {
                labelfor: '@',
                labeltext: '@'
            },
            template: '<div class="pmt-form-row">' +
                '<label class="pmt-form-label" for="{{labelfor}}">{{ labeltext }}</label>' +
                '<div class="pmt-form-controls" ng-transclude>' +
                '</div>'
        };
    }
]);
angular.module('formly.render').directive('validateSubmit', [

    function($parse) {
        return {
            restrict: 'A',
            require: ['?form'],
            link: function(scope, formElement, attrs) {
                var form = scope[attrs.name];

                formElement.bind('submit', function() {
                    angular.forEach(form, function(field, name) {
                        if (typeof(name) === 'string' && !name.match('^[\$]')) {
                            if (field.$pristine && !field.$viewValue) {
                                field.$setViewValue('');
                            }
                            if (field.$viewValue) {
                                field.$setViewValue(field.$viewValue);
                            }
                        }
                    });
                    if (form.$valid) {
                        scope.$apply(attrs.validateSubmit);
                    }
                    scope.$apply();
                });
            }
        };
    }
]);