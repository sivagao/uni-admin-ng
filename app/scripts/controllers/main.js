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

        $scope.$on('metaData:update', function() {
            initCurrentStatus();
        });
        if ($rootScope._ctx.currentResource) {
            initCurrentStatus();
        }

        function initCurrentStatus() {
            $rootScope.$broadcast('siteMenu:refresh');
            $rootScope._ctx.currentApp = _.find($rootScope._ctx._meta, function(item) {
                return item.key === $route.current.params.app;
            });
            $rootScope._ctx.currentResource = _.find($rootScope._ctx.currentApp.children, function(item) {
                return item.key === $route.current.params.resource;
            });
            if (['ebookRanklist', 'wallpaperRanklist'].indexOf($route.current.params.app) > -1) {
                $rootScope._ctx._modelData = {
                    meta: {},
                    page: {
                        current: 2,
                        per: 30,
                        total: 420
                    },
                    list: processAPIData($route.current.params.resource)
                };
                if ($route.current.params.app === 'ebookRanklist') {
                    $rootScope._ctx._fields = $rootScope._ctx._ebookRankListFields;
                } else {
                    $rootScope._ctx._fields = $rootScope._ctx._wallpaperRankListFields;
                }
            } else {
                $rootScope._ctx._fields = $rootScope._ctx._baseFields;
                $http.get('/fake.baseModelData.js').then(function(resp) {
                    $rootScope._ctx._modelData = resp.data;
                });
            }
        }

        function processAPIData(type) {
            // http://192.168.100.38:8983/ebooks/api/v1/ranklist?ranklistName=RANKLIST_SUBSCRIBE
            // var EBOOK_HOST = 'http://192.168.100.38:8983';
            // var API_PREFIX = EBOOK_HOST + '/ebooks/api/v1';
            var API_PREFIX;
            switch ($route.current.params.app) {
                case 'ebookRanklist':
                    API_PREFIX = '/ebooks/api/v1';
                    break;
                case 'wallpaperRanklist':
                    API_PREFIX = '/wallpapers/api/v1';
                    break;
            }
            $http.get(API_PREFIX + '/ranklist', {
                params: {
                    ranklistName: type
                }
            }).then(function(resp) {
                $rootScope._ctx._modelData.list = resp.data || [];
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

        $scope.deleteBatchHandler = function(item) {
            // get the selected items here
            return;
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
            var _ids = _.pluck($rootScope._ctx._modelData.list, 'id');
            if (_.uniq(_ids).length != _ids.length) {
                $rootScope._ctx.alerts = $rootScope._ctx.alerts || [];
                $rootScope._ctx.alerts.push({
                    type: 'danger',
                    msg: 'ebookIds 有重复的！请检查'
                });
                return;
            }
            var _post = {
                rankName: $route.current.params.resource,
                ebookIds: _ids.join(',')
            };
            console.log(_post);
            $(ev.target).html('保存中').prop('disabled', true);
            $http.get('/ebooks/api/admin/ebook/updateAllRanklist', {
                params: _post
            }).then(function(resp) {
                $timeout(function() {
                    $(ev.target).html('保存').prop('disabled', false);
                }, 1000);
            });
        };

        // global alerty
        $rootScope.closeAlert = function(idx) {
            $rootScope._ctx.alerts.splice(idx, 1);
        };

        if ($route.current.params.app === 'wallpaperRanklist') {
            $scope.getSearchResult = function(query) {
                return $http.get('/wallpapers/online/api/v1/category/search/' + query + '?start=0&max=60').then(function(resp) {
                    return resp.data.result;
                });
            }
        }

        // for intro help
        // $scope.
    });