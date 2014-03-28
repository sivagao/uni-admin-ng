'use strict';

angular.module('uniAdminApp')
    .controller('homeCtrl', function($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }).controller('ModelListCtrl', function($scope, $rootScope, $route, $timeout) {
        $rootScope._ctx = {};
        $rootScope._ctx._meta = [{
            key: 'video',
            val: '视频',
            icon: 'fa-flag',
            type: 'APPLICATION',
            children: [{
                key: 'tv1',
                val: '短片',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }, {
                key: 'tv2',
                val: '电视剧',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }, {
                key: 'film',
                val: '电影',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }]
        }, {
            key: 'ebook',
            val: '电纸书',
            icon: 'fa-flag',
            type: 'APPLICATION',
            children: [{
                key: 'tv1',
                val: '短片',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }, {
                key: 'tv2',
                val: '电视剧',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }, {
                key: 'film',
                val: '电影',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }]
        }, {
            key: 'wallpaper',
            val: '壁纸',
            icon: 'fa-flag',
            type: 'APPLICATION',
            children: [{
                key: 'tv1',
                val: '短片',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }, {
                key: 'tv2',
                val: '电视剧',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }, {
                key: 'film',
                val: '电影',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {}
            }]
        }];
        $rootScope._ctx._fields = [{
            type: 'number',
            name: 'videoId',
            key: 'videoId'
        }, {
            type: 'enumerator',
            name: '电影类型',
            key: 'videoType',
            choices: [{
                key: 'type1',
                val: '惊悚'
            }, {
                key: 'typew',
                val: '戏剧'
            }, {
                key: 'type3',
                val: '动作'
            }, {
                key: 'type4',
                val: '爱情'
            }]
        }, {
            type: 'date',
            name: '发行时间',
            key: 'publishDate',
            sortable: true
        }, {
            type: 'char',
            name: '片名',
            key: 'videoTitle'
        }];

        $timeout(function() {
            $rootScope.$emit('refreshSiteMenu');
            $rootScope._ctx.currentApp = _.find($rootScope._ctx._meta, function(item) {
                return item.key === $route.current.params.app;
            });
            $rootScope._ctx.currentResource = _.find($rootScope._ctx.currentApp.children, function(item) {
                return item.key === $route.current.params.resource;
            });
        });
    });