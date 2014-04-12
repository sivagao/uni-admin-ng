'use strict';

angular.module('uniAdminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'uniAdmin.directives',
    'uniAdmin.filters',
    'uniAdmin.decorators',
    'uniAdmin.services',
    'formly',
    'angular-intro',
    'chieffancypants.loadingBar',
    'btford.markdown'
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
    }).run(function($rootScope, $timeout, $modal, $http) {
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
        $http.get('/fake.meta.js').then(function(resp) {
            $rootScope._ctx._meta = resp.data;
            return $http.get('/fake.ebookranklist.meta.js');
        }).then(function(resp) {
            $rootScope._ctx._meta.push(resp.data);
            return $http.get('/fake.ebookranklist.fields.js');
        }).then(function(resp) {
            $rootScope._ctx._ebookRankListFields = resp.data;
            return $http.get('/fake.wallpaperranklist.meta.js');
        }).then(function(resp) {
            $rootScope._ctx._meta.push(resp.data);
            return $http.get('/fake.wallpaperranklist.fields.js');
        }).then(function(resp) {
            $rootScope._ctx._wallpaperRankListFields = resp.data;
            return $http.get('/fake.basefields.js');
        }).then(function(resp) {
            $rootScope._ctx._baseFields = resp.data;
            $rootScope.$broadcast('metaData:init');
            $rootScope._ctx._loaded = true;
        });

        // formly demo
        $http.get('/fake.formly.demo.js').then(function(resp) {
            $rootScope.formFields = resp.data.formFields;
            $rootScope.formOptions = resp.data.formOptions;
        });

        $rootScope.submitHandler = function() {
            $rootScope.submittedData = $scope.autoNgform;
        };

        $rootScope.openFormlyModal = function() {
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