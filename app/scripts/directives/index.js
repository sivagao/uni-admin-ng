'use strict';

angular.module('uniAdmin.directives', [
    'ui.bootstrap'
]).directive('topNav', function($rootScope) {
    return {
        templateUrl: '/views/snippets/top-nav.html',
        scope: true,
        link: function(scope, elem, attrs) {
            scope.$on('metaData:init', function() {
                scope._searches = [];
                scope._addes = [];
                _.each($rootScope._ctx._meta, function(item) {
                    var _prefix = item.val;
                    scope._searches = scope._searches.concat(_.map(item.children, function(i) {
                        return {
                            name: _prefix + ' - ' + i.val,
                            url: ''
                        };
                    }));
                });
                scope._addes = scope._searches;
            });
        }
    }
}).directive('footer', function() {
    return {
        templateUrl: '/views/snippets/footer.html'
    }
}).directive('globalThemes', function($timeout) {
    return {
        replace: true,
        scope: true,
        templateUrl: '/views/snippets/global-themes.html',
        link: function(scope, elem, attrs) {
            scope._themes = [{
                name: '默认',
                href: '/vendor/xadmin/css/themes/bootstrap-xadmin.css'
            }, {
                name: 'Bootstrap2',
                href: '/vendor/xadmin/css/themes/bootstrap-theme.css'
            }, {
                name: 'Cerulean',
                href: 'http://bootswatch.com/cerulean/bootstrap.min.css'
            }, {
                name: 'Cosmo',
                href: 'http://bootswatch.com/sosmo/bootstrap.min.css'
            }, {
                name: 'Cyborg',
                href: 'http://bootswatch.com/cyborg/bootstrap.min.css'
            }, {
                name: 'Darkly',
                href: 'http://bootswatch.com/darkly/bootstrap.min.css'
            }, {
                name: 'Journal',
                href: 'http://bootswatch.com/journal/bootstrap.min.css'
            }, {
                name: 'Lumen',
                href: 'http://bootswatch.com/lumen/bootstrap.min.css'
            }, {
                name: 'Simplex',
                href: 'http://bootswatch.com/simplex/bootstrap.min.css'
            }, {
                name: 'Readable',
                href: 'http://bootswatch.com/readable/bootstrap.min.css'
            }, {
                name: 'Simplex',
                href: 'http://bootswatch.com/simplex/bootstrap.min.css'
            }, {
                name: 'Slate',
                href: 'http://bootswatch.com/slate/bootstrap.min.css'
            }, {
                name: 'Spacelab',
                href: 'http://bootswatch.com/spacelab/bootstrap.min.css'
            }, {
                name: 'Superhero',
                href: 'http://bootswatch.com/superhero/bootstrap.min.css'
            }, {
                name: 'united',
                href: 'http://bootswatch.com/united/bootstrap.min.css'
            }, {
                name: 'Yeti',
                href: 'http://bootswatch.com/yeti/bootstrap.min.css'
            }];
            $timeout((function(scope) {
                return function() {
                    var themeHref = $.getCookie('_theme');
                    var _idx;
                    if (themeHref) {
                        _idx = _.pluck(scope._themes, 'href').indexOf(themeHref);
                        $('#site-theme').attr('href', themeHref);
                        $('#g-theme-menu li').eq(_idx).addClass('active');
                    }
                    var top_nav = $('#top-nav');

                    if ($("#g-theme-menu")) {
                        $('#g-theme-menu li>a').click(function() {
                            var $el = $(this);
                            var themeHref = $el.data('css-href');

                            var topmenu = $('#top-nav .navbar-collapse');
                            if (topmenu.data('bs.collapse')) topmenu.collapse('hide');

                            var modal = $('<div id="load-theme-modal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4>' +
                                'Loading theme</h4></div><div class="modal-body"><h2 style="text-align:center;"><i class="fa-spinner fa-spin fa fa-large"></i></h2></div></div></div></div>');
                            $('body').append(modal);

                            modal.on('shown.bs.modal', function() {
                                $.setCookie('_theme', themeHref);

                                var iframe = document.createElement("IFRAME");
                                iframe.style.display = 'none';
                                document.body.appendChild(iframe);

                                modal.on('hidden', function(e) {
                                    if (iframe) {
                                        $(iframe).unbind('load');
                                        iframe.parentNode.removeChild(iframe);
                                        iframe = null;
                                    }
                                    modal.remove();
                                });

                                $(iframe).load(function() {
                                    $('#site-theme').attr('href', themeHref);

                                    setTimeout(function() {
                                        var nav_height = $('#top-nav').height();
                                        $('#body-content').animate({
                                            'margin-top': (nav_height + 15)
                                        }, 500, 'easeOutBounce');
                                    }, 500);

                                    modal.modal('hide');
                                    iframe.parentNode.removeChild(iframe);
                                    iframe = null;
                                })

                                var ifmDoc = iframe.contentDocument || iframe.contentWindow.document;
                                ifmDoc.open();
                                ifmDoc.write('<!doctype><html><head></head><body>');
                                ifmDoc.write('<link rel="stylesheet" href="' + themeHref + '" />');
                                ifmDoc.write('</body></html>');
                                ifmDoc.close();


                                $('#g-theme-menu li').removeClass('active');
                                $el.parent().addClass('active');
                            })

                            modal.modal().css({
                                'margin-top': function() {
                                    return window.pageYOffset;
                                }
                            });
                        })
                    }
                }
            })(scope));
        }
    }
}).directive('siteMenu', function($timeout, $route, $rootScope) {
    return {
        templateUrl: '/views/snippets/site-menu.html',
        link: function(scope, elem, attr) {

            // 切换active status
            elem.on('click', 'a.list-group-item', function(e) {
                elem.find('.active').removeClass('active');
                elem.find('.panel-info').removeClass('panel-info').addClass('panel-default');
                $(this).addClass('active').parents('.panel').removeClass('panel-default').addClass('panel-info');
            });

            // refresh后添加active状态
            // $route.current.params -> app, resource
            var refreshFn = function() {
                if (!$route.current.params.app) {
                    elem.find('.panel').removeClass('panel-info').addClass('panel-default')
                        .find('.panel-collapse').removeClass('in')
                        .find('a.list-group-item').removeClass('active');
                    return;
                }
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
            scope.$on('siteMenu:refresh', refreshFn);
        }
    }
}).directive('modelListFilter', function($timeout, $rootScope) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-filter.html',
        link: function(scope, elem, attrs) {
            // design data structure
            // key的类型-》 char, daytime, select，foreign-key, number
            scope.$on('metaData:ml', _update);
            var _update = function() {
                scope._fields = $rootScope._ctx._fields;
            };
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
        link: function(scope, elem, attrs) {}
    }
}).directive('modelListExport', function($timeout, $rootScope, downloadFile) {
    return {
        replace: true,
        scope: true,
        templateUrl: '/views/snippets/model-list-export.html',
        link: function(scope, elem, attrs) {
            var stringifyCell = function(data) {
                if (typeof data === 'string') {
                    data = data.replace(/"/g, '""'); // Escape double qoutes
                    return data;
                }
                if (typeof data === 'boolean') {
                    return data ? 'TRUE' : 'FALSE';
                }
                return data;
            };

            function exportTableToCSV(array, filename) {
                var csvContent = 'data:text/csv;charset=utf-8,';
                csvContent += encodeURIComponent(_.map(array, function(row) {
                    return _.map(row, function(td) {
                        return stringifyCell(td);
                    }).join(',');
                }).join('\r\n'));

                return csvContent;
            }

            function preExportData() {
                var head = _.pluck($rootScope._ctx._fields, 'name');
                var body = _.map($rootScope._ctx._modelData.list, function(row) {
                    return _.filter(row, function(val, key) {
                        if (key.indexOf('$$') != 0) {
                            return val;
                        }
                    })
                });
                body.unshift(head);
                return body;
            }
            scope.exportCSVHandler = function() {
                downloadFile(exportTableToCSV.apply(this, [preExportData(), 'export.csv']));
            };
        }
    }
}).directive('modelListBreadcrumb', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-breadcrumb.html',
        link: function(scope, elem, attrs) {}
    }
}).directive('modelListBookmarks', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-bookmarks.html',
        link: function(scope, elem, attrs) {}
    }
}).directive('modelListSearch', function($timeout) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-search.html',
        link: function(scope, elem, attrs) {}
    }
}).directive('modelListIntro', function($timeout, $rootScope) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-intro.html',
        link: function(scope, elem, attrs) {
            scope.$on('metaData:ml', function() {
                if ($rootScope._ctx.currentApp.meta && ('IntroOptions' in $rootScope._ctx.currentApp.meta)) {
                    scope.IntroOptions = $rootScope._ctx.currentApp.meta.IntroOptions;
                }
                if ($rootScope._ctx.currentResource.meta && ('IntroOptions' in $rootScope._ctx.currentResource.meta)) {
                    scope.IntroOptions = $rootScope._ctx.currentResource.meta.IntroOptions;
                }
            });
        }
    }
}).directive('modelListLayout', function($timeout, $rootScope) {
    return {
        replace: true,
        scope: true,
        templateUrl: '/views/snippets/model-list-layout.html',
        link: function(scope, elem, attrs) {
            scope.changeLayout = function(type) {
                $rootScope._ctx.currentResource.meta.layout = type;
            };
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
}).directive('modelListActions', function($timeout, $rootScope) {
    return {
        replace: true,
        templateUrl: '/views/snippets/model-list-actions.html',
        link: function(scope, elem, attrs) {
            scope.$on('metaData:ml', function() {
                // to support extend from app, resource
                if ($rootScope._ctx.currentApp.meta && $rootScope._ctx.currentApp.meta.batchActions) {
                    scope._batchActions = $rootScope._ctx.currentApp.meta.batchActions;
                }
                if ($rootScope._ctx.currentResource.meta && $rootScope._ctx.currentResource.meta.batchActions) {
                    scope._batchActions = $rootScope._ctx.currentResource.meta.batchActions;
                }
            });
            // trigger fn.actions on
            $timeout(function() {
                elem.find('.dropdown-menu').on('click', 'li', function(e) {
                    var _scope = $(this).scope();
                    try {
                        _scope[$(this).find('a').attr('action-handler')].call(_scope, _scope.$item);
                    } catch (e) {
                        console.log(e);
                    }
                    scope.$apply();
                    return false;
                });
                var onchange = function() {
                    var s = (document.body.scrollTop || document.documentElement.scrollTop) + window.innerHeight;
                    var height = $('#footer').offset().top;
                    if (s < height) {
                        elem.show();
                    }
                    if (s > (height + 50)) {
                        elem.hide();
                    }
                }
                if (elem.attr('fixed') === 'true') {
                    elem.addClass('fixed');
                    window.onscroll = _.throttle(onchange, 300);
                    onchange();
                    if (window.__admin_ismobile__) {
                        $(window).bind('resize', function(e) {
                            var rate = $(window).height() / $(window).width();
                            if (rate < 1) {
                                elem.css('display', 'none');
                            } else {
                                elem.css('display', 'block');
                            }
                        });
                    }
                }

            });
        }
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
        link: function(scope, elem, attrs) {
            scope.$on('metaData:ml', function() {
                scope._fields = $rootScope._ctx._fields;
            });
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
        link: function(scope, elem, attrs) {
            $rootScope.$watch('_ctx._modelData.list', function(val) {
                if (val) {
                    scope._list = $rootScope._ctx._modelData.list;
                }
            }, true);
            $timeout(function() {
                $(".results input.action-select").actions();
            });
            /*
                scope._fields = _.map($rootScope._ctx._fields, function(item) {
                    return _.values(_.pick(item, 'key', 'type'));
                });
                scope._fields = _.object(scope._fields);
             */
        }
    }
}).directive('modelListResBlock', function($timeout, $rootScope, $http) {
    return {
        templateUrl: '/views/snippets/model-list-res-block.html',
        scope: true,
        link: function(scope, elem, attrs) {

            $rootScope.$watch('_ctx._modelData', function(val) {
                if (val) {
                    scope._list = $rootScope._ctx._modelData.list;
                    $timeout(function() {
                        $(".results input.action-select").actions();
                        elem.find('.related_menu').on('click', 'li', function(e) {

                            var _scope = $(this).scope();
                            try {
                                _scope[$(this).find('a').attr('action-handler')].call(_scope, _scope.$item);
                            } catch (e) {
                                console.log(e);
                            }
                            scope.$apply();
                            return false;
                            // call the passed drop function
                            // scope.$apply(function(scope) {
                            //     var fn = scope.drop();
                            //     if ('undefined' !== typeof fn) {
                            //         fn(srcId, destId);
                            //     }
                            // });
                        });
                        var maxItemHeight = 0;
                        elem.find('.thumbnail').each(function(idx, item) {
                            if (maxItemHeight < $(item).height()) {
                                maxItemHeight = $(item).height();
                            }
                        });
                        elem.find('.thumbnail').height(maxItemHeight);
                    }, 1000);
                }

            }, true);

        }
    }
}).directive('modelListEditable', function($timeout, $rootScope, $templateCache, $http, $compile) {
    return {
        scope: true,
        link: function(scope, elem, attrs) {
            if (!$templateCache.get('/views/snippets/model-list-editable.html')) {
                $http.get('/views/snippets/model-list-editable.html').then(function(resp) {
                    $templateCache.put('/views/snippets/model-list-editable.html', resp.data);
                });
            }
            scope._field = elem.scope()._field;
            // scope._val = elem.parents('td').find('.editable-field').html();
            scope._val = elem.scope().$parent.$parent.$parent.$item[scope._field.key];

            $.fn.editpop.Constructor.prototype.beforeToggle = function() {
                var $el = this.$element
                if (this.content == null) {
                    var that = this
                    $el.find('>i').removeClass('fa fa-edit').addClass('fa-spinner fa-spin');
                    var content = $compile('<div model-list-editable-tpl></div>')(scope);
                    $el.find('>i').removeClass('fa-spinner fa-spin').addClass('fa fa-edit');
                    that.content = content;
                    that.toggle();
                } else {
                    this.toggle()
                }
            }
            elem.editpop();
        }
    }
}).directive('modelListEditableTpl', function($timeout, $rootScope, $templateCache, $http, $compile) {
    return {
        scope: true,
        templateUrl: '/views/snippets/model-list-editable.html',
        link: function(scope, elem, attrs) {
            scope._field = elem.scope()._field;
        }
    }
}).directive('imgTooltip', function($timeout, $rootScope, $templateCache, $http, $compile) {
    return {
        scope: true,
        // priority: 100,
        link: function(scope, elem, attrs) {
            elem.wTooltip({
                className: 'image-tooltip-wrap',
                delay: 300,
                offsetX: 50,
                offsetY: 50,
                content: "<img src=" + attrs['tooltipUrl'] + " alt='bigger image' />"
            });
        }
    }
}).directive('resBlockDraggable', function($timeout, $rootScope, $templateCache, $http, $compile) {
    return {
        scope: true,
        restrict: 'AC',
        link: function(scope, elem, attrs) {
            var el = elem[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function(e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    $(this).addClass('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function(e) {
                    $(this).removeClass('drag');
                    return false;
                },
                false
            );
        }
    }
}).directive('resBlockDroppable', function($timeout, $rootScope, $templateCache, $http, $compile) {
    return {
        scope: {
            drop: '&',
            bin: '='
        },
        restrict: 'AC',
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener(
                'dragover',
                function(e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    $(this).addClass('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragenter',
                function(e) {
                    $(this).addClass('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function(e) {
                    $(this).removeClass('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();

                    $(this).removeClass('over');
                    var srcId = e.dataTransfer.getData('Text');
                    var destId = this.id;

                    // call the passed drop function
                    scope.$apply(function(scope) {
                        var fn = scope.drop();
                        if ('undefined' !== typeof fn) {
                            fn(srcId, destId);
                        }
                    });

                    return false;
                },
                false
            );
        }
    }
}).directive('globalInlineHelp', function() {
    return {
        templateUrl: '/views/snippets/global-inline-help.html',
        link: function() {

        }
    }
});
// what's the f**k
// end of directives.js