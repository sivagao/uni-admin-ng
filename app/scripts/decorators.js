angular.module('uniAdmin.decorators', [])
    .constant('UNI_ADMIN_SERVER_PATH', '//test.wandoujia.com')
    .factory('uniAdmin.HttpInterceptor', ['$q', '$rootScope', '$document', 'UNI_ADMIN_SERVER_PATH',

        function($q, $rootScope, $document, UNI_ADMIN_SERVER_PATH) {
            var PROTECTION_PREFIX = /^\)\]\}',?\n/;
            $rootScope.API_HOST = UNI_ADMIN_SERVER_PATH;

            var PROTOCOL_PREFIX = /^https?\:\/\//;
            var API_PREFIX = /^\/api/;
            var API_URL_PREFIX = new RegExp('^' + UNI_ADMIN_SERVER_PATH + '/api');

            var resolve = {
                isAPI: function(url) {

                },
                resolve: function() {

                }
            };

            function resolveUrl(config) {
                config.originUrl = config.url;
                // config.url = pmtUrl.resolve(config.url);
            }

            function restoreUrl(config) {
                if ('originUrl' in config) {
                    config.url = config.originUrl;
                    delete config.originUrl;
                }
            }

            return {
                // request: function(config) {
                //     // resolveUrl(config);
                //     if (!('withCredentials' in config)) {
                //         config.withCredentials = true;
                //     }

                //     return config;
                // },
                // response: function(response) {
                //     // restoreUrl(response.config);
                //     // unwrapResponse(response);
                //     return response;
                // },
                responseError: function(response) {
                    // restoreUrl(response.config);
                    // unwrapResponse(response);

                    // alert 或者 填入到$rootScope._ctx.alerts中
                    $rootScope._ctx.alerts = $rootScope._ctx.alerts || [];
                    $rootScope._ctx.alerts.push({
                        type: 'danger',
                        msg: 'error-' + response.status + ': ' +
                            (response.data || '') + ', 接口出问题啦!'
                    });
                    return $q.reject(response);
                }
            };
        }
    ])
    .config(['$httpProvider',
        function($httpProvider) {
            // We'll handle response ourselves.
            // $httpProvider.defaults.transformResponse.splice(0, 1);
            $httpProvider.interceptors.push('uniAdmin.HttpInterceptor');
        }
    ]);