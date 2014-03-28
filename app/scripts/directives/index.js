'use strict';

angular.module('uniAdmin.directives', [
    'ui.bootstrap'
]).directive('topNav', function() {
    return {
        templateUrl: '/views/snippets/top-nav.html'
    }
}).directive('footer', function() {
    return {
        templateUrl: '/views/snippets/footer.html'
    }
}).directive('siteMenu', function($timeout, $route, $rootScope) {
    return {
        templateUrl: '/views/snippets/site-menu.html',
        link: function(scope, elem, attr) {
            scope._ctx = {};
            scope._ctx._meta = $rootScope._ctx._meta;

            // 切换active status
            elem.on('click', 'a.list-group-item', function(e) {
                elem.find('.active').removeClass('active');
                elem.find('.panel-info').removeClass('panel-info').addClass('panel-default');
                $(this).addClass('active').parents('.panel').removeClass('panel-default').addClass('panel-info');
            });

            // refresh后添加active状态
            // $route.current.params -> app, resource
            var refreshFn = function() {
                var _x1 = _.find(scope._ctx._meta, function(item) {
                    return item.key === $route.current.params.app
                });
                var _x2 = _.find(_x1.children, function(item) {
                    return item.key === $route.current.params.resource
                });
                _x2 = _x1.children.indexOf(_x2);
                _x1 = scope._ctx._meta.indexOf(_x1);
                elem.find('.panel').eq(_x1)
                    .removeClass('panel-default').addClass('panel-info')
                    .find('.panel-collapse').addClass('in')
                    .find('a.list-group-item').eq(_x2).addClass('active');
            };
            $rootScope.$on('refreshSiteMenu', function(val) {
                if (!val) return;
                refreshFn();
            });
        }
    }
}).directive('modelListFilter', function($timeout, $rootScope) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-filter.html',
        link: function(scope, elem, filter) {
            // design data structure
            // key的类型-》 char, daytime, select，foreign-key, number
            scope._fields = $rootScope._ctx._fields;
            // filter
            $(document).on('click', '.filter-multiselect input[type=checkbox]', function(e) {
                window.location.href = $(this).parent().attr('href');
            }).on('click', '.filter-number .remove', function(e) {
                // menber filter
                $(this).parent().parent().find('input[type="number"]').val('');
            }).on('click', '.filter-number .toggle', function(e) {
                var new_name = $(this).hasClass('active') ? $(this).attr('data-off-name') : $(this).attr('data-on-name');
                $(this).parent().parent().find('input[type="number"]').attr('name', new_name);
            }).on('submit', '#filter-menu form', function() {
                $(this).find('input[type="text"],input[type="number"]').each(function(e) {
                    if (!$(this).val()) $(this).attr('name', '');
                });
                return true;
            });

            $timeout(function() {
                $('.menu-date-range form').each(function() {
                    var el = $(this);
                    var start_date = el.find('.calendar.date-start').datepicker({
                        format: $.date_local.dateJSFormat,
                        language: 'xadmin'
                    });
                    var end_date = el.find('.calendar.date-end').datepicker({
                        format: $.date_local.dateJSFormat,
                        language: 'xadmin'
                    });

                    var checkAvailable = function() {
                        if (start_date.data('datepicker').getDate().valueOf() <= end_date.data('datepicker').getDate().valueOf()) {
                            el.find('button[type=submit]').removeAttr('disabled');
                        } else {
                            el.find('button[type=submit]').attr('disabled', 'disabled');
                        }
                    }

                    start_date.on('changeDate', function(ev) {
                        var startdate = start_date.data('date');
                        el.find('.start_input').val(startdate);
                        end_date.data('datepicker').setStartDate(startdate);
                        checkAvailable();
                    });
                    end_date.on('changeDate', function(ev) {
                        var enddate = end_date.data('date');
                        el.find('.end_input').val(enddate);
                        start_date.data('datepicker').setEndDate(enddate);
                        checkAvailable();
                    });

                    checkAvailable();
                });
            }, 0);

            //dropdown submenu plugin
            $(document)
                .on('click.xa.dropdown.data-api touchstart.xa.dropdown.data-api', '.dropdown-submenu', function(e) {
                    e.stopPropagation();
                })
                .on('click.xa.dropdown.data-api', function(e) {
                    $('.dropdown-submenu.open').removeClass('open');
                });

            if ('ontouchstart' in document.documentElement) {
                $(document).on('click.xa.dropdown.data-api', '.dropdown-submenu a', function(e) {
                    $(this).parent().toggleClass('open');
                });
            } else {
                $(document).on('click.xa.dropdown.data-api mouseover.xa.dropdown.data-api', '.dropdown-submenu', function(e) {
                    $(this).parent().find('>.dropdown-submenu.open').removeClass('open');
                    $(this).addClass('open');
                });
            }
        }
    }
}).directive('modelListColumns', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-columns.html',
        link: function(scope, elem, filter) {}
    }
}).directive('modelListExport', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-export.html',
        link: function(scope, elem, filter) {}
    }
}).directive('modelListBreadcrumb', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-breadcrumb.html',
        link: function(scope, elem, filter) {}
    }
}).directive('modelListBookmarks', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-bookmarks.html',
        link: function(scope, elem, filter) {}
    }
}).directive('modelListSearch', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-search.html',
        link: function(scope, elem, filter) {}
    }
}).directive('modelListLayout', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-layout.html',
        link: function(scope, elem, filter) {
            $timeout(function() {
                //full screen btn
                $('.layout-btns .layout-full').click(function(e) {
                    var icon = $(this).find('i')
                    if ($(this).hasClass('active')) {
                        // reset
                        $('#left-side, ul.breadcrumb').show('fast');
                        $('#content-block').removeClass('col-md-12 col-sm-12 full-content').addClass('col-sm-11 col-md-10');
                        icon.removeClass('fa-compress').addClass('fa-expand');
                        $(window).trigger('resize');
                        $(this).removeClass('active')
                    } else {
                        // full screen
                        $('#left-side, ul.breadcrumb').hide('fast', function() {
                            $('#content-block').removeClass('col-sm-11 col-md-10').addClass('col-md-12 col-sm-12 full-content');
                            icon.removeClass('fa-expand').addClass('fa-compress');
                            $(window).trigger('resize');
                        });
                        $(this).addClass('active')
                    }
                });

                $('.layout-btns .layout-normal').click(function(e) {
                    $('.results table').removeClass('table-condensed');
                });

                $('.layout-btns .layout-condensed').click(function(e) {
                    $('.results table').addClass('table-condensed');
                });
            });
        }
    }
}).directive('modelListActions', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-actions.html',
        link: function(scope, elem, filter) {}
    }
}).directive('modelListThead', function($timeout, $rootScope) {
    return {
        templateUrl: '/views/snippets/model-list-thead.html',
        controller: function($scope) {
            $scope.cancelSort = function() {
                this.$field.sortDown = false;
                this.$field.sortUp = false;
            };
        },
        link: function(scope, elem, filter) {
            scope._fields = $rootScope._ctx._fields;
            $timeout(function() {
                elem.find('.fa-caret-up, .fa-caret-down').parents('li').click(function() {
                    var _scope = angular.element(this).scope();
                    if ($(this).find('.fa-caret-up').length) {
                        _scope.$field.sortUp = true;
                        _scope.$field.sortDown = false;
                    } else {
                        _scope.$field.sortDown = true;
                        _scope.$field.sortUp = false;
                    }
                    _scope.$apply();
                });
                elem.on('click', '.fa-sort-down, .fa-sort-up', function() {
                    var _scope = angular.element(this).scope();
                    _scope.$field.sortDown = !_scope.$field.sortDown;
                    _scope.$field.sortUp = !_scope.$field.sortUp;
                    _scope.$apply();
                });
            });
        }
    }
}).directive('modelListTr', function($timeout, $rootScope) {
    return {
        templateUrl: '/views/snippets/model-list-tr.html',
        scope: true,
        link: function(scope, elem, filter) {
            scope._list = $rootScope._ctx._modelData.list;
            // scope._fields = _.map($rootScope._ctx._fields, function(item) {
            //     return _.values(_.pick(item, 'key', 'type'));
            // });
            // scope._fields = _.object(scope._fields);
        }
    }
});
// what's the f**k
// end of directives.js