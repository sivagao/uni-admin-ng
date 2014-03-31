'use strict';

angular.module('uniAdminApp')
    .controller('homeCtrl', function($scope, $rootScope, $route, $timeout, $http) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $rootScope.$emit('refreshSiteMenu');
    }).controller('ModelListCtrl', function($scope, $rootScope, $route, $timeout, $http) {

        $timeout(function() {
            $rootScope.$emit('refreshSiteMenu');
            $rootScope._ctx.currentApp = _.find($rootScope._ctx._meta, function(item) {
                return item.key === $route.current.params.app;
            });
            $rootScope._ctx.currentResource = _.find($rootScope._ctx.currentApp.children, function(item) {
                return item.key === $route.current.params.resource;
            });
        });

        if ($route.current.params.app === 'ebookRanklist') {
            $rootScope._ctx._fields = [{
                type: 'char',
                name: '书名',
                key: 'title',
                meta: {
                    linkable: true
                }
            }, {
                type: 'char',
                name: '状态',
                key: 'status',
            }, {
                type: 'char',
                name: '类目',
                key: 'topCategory',
            }, {
                type: 'char',
                name: '描述',
                key: 'description',
            }, {
                type: 'image',
                name: '封面',
                key: 'cover.l',
            }];

            $rootScope._ctx._modelData = {
                meta: {},
                page: {
                    current: 2,
                    per: 30,
                    total: 420
                },
                list: processEbookRanklistAPIData($route.current.params.resource)
            };
            processEbookRanklistAPIData($route.current.params.resource);
        } else {
            $rootScope._ctx._fields = $rootScope._ctx._baseFields;
            $rootScope._ctx._modelData = $rootScope._ctx._baseModelData;
        }

        function processEbookRanklistAPIData(type) {
            // http://192.168.100.38:8983/ebooks/api/v1/ranklist?ranklistName=RANKLIST_SUBSCRIBE
            var API_PREFIX = 'http://192.168.100.38:8983/ebooks/api/v1';
            $http.get(API_PREFIX + '/ranklist', {
                params: {
                    ranklistName: type
                }
            }).then(function(resp) {
                $rootScope._ctx._modelData.list = resp.data;
            });
        }

    });