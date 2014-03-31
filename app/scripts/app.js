'use strict';

angular.module('uniAdminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'uniAdmin.directives',
    'uniAdmin.filters',
    'formly'
])
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        var noop = function() {};
        $routeProvider
            .when('/', {
                templateUrl: '/views/home.html',
                controller: 'homeCtrl'
            })
            .when('/category/:app/resource/:resource', {
                templateUrl: '/views/model-list.html',
                controller: 'ModelListCtrl',
                reloadOnSearch: false
            })
            .when('/category/:app', {
                templateUrl: '/views/model-list.html',
                controller: 'AppCtrl'
            })
            .when('/#:partial', {
                controller: noop // TO FIX
            })
            .otherwise({
                redirectTo: '/'
            });
    }).run(function($rootScope, $timeout, $modal) {
        $timeout(function() {
            (function($) {
                $.fn.exform = function() {
                    this.each(function() {
                        var form = $(this);
                        for (var i = $.fn.exform.renders.length - 1; i >= 0; i--) {
                            $.fn.exform.renders[i](form)
                        };
                        form.addClass('rended');
                    })
                }
                $.fn.exform.renders = [];
                $(function() {
                    $('.exform:not(.rended)').exform();
                });

                $.getCookie = function(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                };

                //dropdown submenu plugin
                $(document)
                    .on('click.xa.dropdown.data-api touchstart.xa.dropdown.data-api', '.dropdown-submenu', function(e) {
                        e.stopPropagation();
                    })
                    .on('click.xa.dropdown.data-api', function(e) {
                        $('.dropdown-submenu.open').removeClass('open');
                    });

                if ('ontouchstart' in document.documentElement) {
                    $('.dropdown-submenu a').on('click.xa.dropdown.data-api', function(e) {
                        $(this).parent().toggleClass('open');
                    });
                } else {
                    $('.dropdown-submenu').on('click.xa.dropdown.data-api mouseover.xa.dropdown.data-api', function(e) {
                        $(this).parent().find('>.dropdown-submenu.open').removeClass('open');
                        $(this).addClass('open');
                    });
                }

                //toggle class button
                $('body').on('click.xa.togglebtn.data-api', '[data-toggle=class]', function(e) {
                    var $this = $(this),
                        href
                    var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
                    var className = $this.attr('data-class-name')
                    $(target).toggleClass(className)
                })

                //.nav-content bar nav-menu
                $('.navbar-xs .navbar-nav > li')
                    .on('shown.bs.dropdown', function(e) {
                        $(this).find('>.dropdown-menu').css('max-height', $(window).height() - 120);
                        $(this).parent().find('>li').addClass('hidden-xs');
                        $(this).removeClass('hidden-xs');
                    })
                    .on('hidden.bs.dropdown', function(e) {
                        $(this).parent().find('>li').removeClass('hidden-xs');
                    });

                // dashboard widget
                $('.widget-form').each(function(e) {
                    var el = $(this);
                    el.find('.btn-remove').click(function() {
                        el.find('input[name=_delete]').val('on');
                        return true;
                    });
                });

                // g-search
                $('#g-search .dropdown-menu a').click(function() {
                    $('#g-search').attr('action', $(this).data('action')).submit();
                })

                // save settings
                $.save_user_settings = function(key, value, success, error) {
                    var csrftoken = $.getCookie('csrftoken');
                    success();
                    return;
                    $.ajax({
                        type: 'POST',
                        url: window.__admin_path_prefix__ + 'settings/user',
                        data: {
                            'key': key,
                            'value': value
                        },
                        success: success,
                        error: error,
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    });
                }
            })(jQuery);
        });

        // fake data
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
                meta: {
                    layout: 'inline-block',
                    inlineAdd: true
                }
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
        $rootScope._ctx._baseFields = [{
            type: 'number',
            name: 'videoId',
            key: 'videoId',
            meta: {
                editable: true,
                linkable: true
            }
        }, {
            type: 'image',
            name: '封面',
            key: 'cover'
        }, {
            type: 'char',
            name: '片名',
            key: 'videoTitle'
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
            type: 'boolean',
            name: '下线',
            key: 'offline'
        }];

        $rootScope._ctx._baseModelData = {
            meta: {},
            page: {
                current: 2,
                per: 30,
                total: 420
            },
            list: [{
                videoId: 10001,
                cover: 'http://js.wiyun.com/site_media/images/wallpaper/eac1bce7-90d5-40a7-a7e2-ae02acca2e86_jpg_152x102_crop_upscale_q85.jpg',
                videoTitle: '今晚看啥',
                videoType: '喜剧',
                publishDate: '2014-03-04',
                offline: false,
            }, {
                videoId: 10002,
                cover: 'http://js.wiyun.com/site_media/images/wallpaper/eac1bce7-90d5-40a7-a7e2-ae02acca2e86_jpg_152x102_crop_upscale_q85.jpg',
                videoTitle: '今晚看啥',
                videoType: '喜剧',
                publishDate: '2014-03-04',
                offline: false,
            }, {
                videoId: 10003,
                cover: 'http://js.wiyun.com/site_media/images/wallpaper/eac1bce7-90d5-40a7-a7e2-ae02acca2e86_jpg_152x102_crop_upscale_q85.jpg',
                videoTitle: '今晚看啥',
                videoType: '喜剧',
                publishDate: '2014-03-04',
                offline: false,
            }]
        };

        // add oscar fake api
        var ResourceDescription = {
            key: 'ebookRanklist',
            val: '电子书排行榜',
            icon: 'fa-flag',
            type: 'APPLICATION',
            children: [{
                key: 'RANKLIST_SUBSCRIBE',
                val: '追追看',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {
                    layout: 'inline-block',
                    inlineAdd: true,
                    actions: [{
                        name: '删除',
                        func: 'delete'
                    }, {
                        name: '发送到首页',
                        func: 'sendToHome'
                    }]
                }
            }, {
                key: 'RANKLIST_FINISH',
                val: '完结',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {
                    layout: 'inline-block',
                    inlineAdd: true
                }
            }, {
                key: 'RANKLIST_HOT_RANK',
                val: '排行榜',
                icon: 'fa-flag',
                type: 'RESOURCE',
                meta: {
                    layout: 'inline-block',
                    inlineAdd: true
                }
            }]
        };

        $rootScope._ctx._meta.push(ResourceDescription);

        // Public Vars
        $rootScope.formFields = [{
            label: '电子邮箱',
            key: 'email',
            type: 'email',
            placeholder: 'janedoe@gmail.com',
            defaultVal: 'ghld@126.com',
            validate: {
                required: true,
                maxlength: 10
                // pattern: '/^[\\d]*@\\.$/'
            },
            msg: {
                help: '这里是普通的help文档',
                xrequired: '必填项',
                maxlength: '最长长度超过了',
                pattern: 'pattern不正确'
            },
            attr: {
                'dynamicAttr': 'value-for'
            }
        }, {
            label: 'textarea控件',
            key: 'textarea',
            type: 'textarea',
            attr: {
                'text-area-elastic': true,
                'rows': '4',
                'cols': '50'
            },
            validate: {
                required: true,
                maxlength: 20,
                minlength: 4
            },
            msg: {
                help: '这里是textarea的help文档',
                xrequired: '必填项',
                maxlength: '最长长度超过了'
            }
        }, {
            type: 'select',
            label: 'select控件',
            key: 'vehicle',
            info: '请选择交通工具',
            options: [{
                name: 'Car',
                value: 'car',
                group: 'inefficiently'
            }, {
                name: 'Helicopter',
                group: 'inefficiently'
            }, {
                name: 'Sport Utility Vehicle',
                group: 'inefficiently'
            }, {
                name: 'Bicycle',
                group: 'efficiently'
            }, {
                name: 'Skateboard',
                group: 'efficiently'
            }]
        }, {
            type: 'password',
            label: 'Password',
            key: 'password'
        }, {
            type: 'checkbox',
            label: 'Check this here',
            key: 'checkbox1'
        }, {
            type: 'hidden',
            default: 'secret_code',
            key: 'secretCode'
        }];
        $rootScope.formOptions = {
            key: 'autoNgform',
            submitCopy: 'Save'
        };

        $rootScope.submitHandler = function() {
            $rootScope.submittedData = $scope.autoNgform;
        };

        $rootScope.open = function() {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $rootScope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    });