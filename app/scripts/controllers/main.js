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
                    linkable: true,
                    maxlength: 10
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
                meta: {
                    maxlength: 50
                }
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
            // var EBOOK_HOST = 'http://192.168.100.38:8983';
            // var API_PREFIX = EBOOK_HOST + '/ebooks/api/v1';
            var API_PREFIX = '/ebooks/api/v1';
            $http.get(API_PREFIX + '/ranklist', {
                params: {
                    ranklistName: type
                }
            }).then(function(resp) {
                $rootScope._ctx._modelData.list = resp.data;
            });
        }

        $scope.dropHandler = function(src, dest) {
            var _src = $rootScope._ctx._modelData.list[src.replace('res-block-', '')];
            $rootScope._ctx._modelData.list[src.replace('res-block-', '')] = $rootScope._ctx._modelData.list[dest.replace('res-block-', '')];
            $rootScope._ctx._modelData.list[dest.replace('res-block-', '')] = _src;
        };
        $scope.deleteHandler = function(item) {
            $rootScope._ctx._modelData.list.splice($rootScope._ctx._modelData.list.indexOf(item), 1);
        };

        $scope.getSearchResult = function(query) {
            // var EBOOK_SEARCH = 'http://192.168.100.38:9190/api/v1/search/';
            var _params;
            switch ($route.current.params.resource) {
                case 'RANKLIST_SUBSCRIBE':
                    _params = {
                        subscribe: true
                    };
                    break;
                case 'RANKLIST_FINISH':
                    _params = {
                        subscribe: false
                    };
                    break;
                case 'RANKLIST_HOT_RANK':
                    _params = {
                        publish_type: 'NETWORK_NOVEL',
                        rank_type: 'history_hot'
                    };
                    break;
            }
            return $http.get('/api/v1/search/' + query, {
                params: _params
            }).then(function(resp) {
                return resp.data.result;
            });
        };

        $scope.typeaheadOnSelectHandler = function(item) {
            $rootScope._ctx._modelData.list.unshift(item);
        };

        $scope.saveRanklist = function(ev) {
            var _post = {
                ranklistName: $route.current.params.resource,
                ebookIds: (_.pluck($rootScope._ctx._modelData.list, 'id')).join(',')
            };
            console.log(_post);
            $(ev.target).html('保存中').prop('disabled', true);
            $http.post('API', _post).then(function(resp) {
                $timeout(function() {
                    $(ev.target).html('保存').prop('disabled', false);
                }, 1000);
            });
        };

        // global alerty
        $rootScope.closeAlert = function(idx) {
            $rootScope._ctx.alerts.splice(idx, 1);
        };
    });