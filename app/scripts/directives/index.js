'use strict';

angular.module('uniAdmin.directives', [
    'ui.bootstrap'
]).directive('topNav', function() {
    return {
        templateUrl: 'views/snippets/top-nav.html'
    }
}).directive('footer', function() {
    return {
        templateUrl: 'views/snippets/footer.html'
    }
}).directive('siteMenu', function() {
    return {
        templateUrl: 'views/snippets/site-menu.html',
        link: function(scope, elem, attr) {
            scope._ctx = {};
            scope._ctx._meta = [{
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

            // 切换active status
            elem.on('click', 'a.list-group-item', function(e) {
                elem.find('.active').removeClass('active');
                elem.find('.panel-info').removeClass('panel-info').addClass('panel-default');
                $(this).addClass('active').parents('.panel').removeClass('panel-default').addClass('panel-info');
            });
        }
    }
}).directive('modelListFilter', function() {
    return {
        replace: true,
        templateUrl: 'views/snippets/model-list-filter.html',
        link: function() {
            // filter
            $('.filter-multiselect input[type=checkbox]').click(function(e) {
                window.location.href = $(this).parent().attr('href');
            });

            // menber filter
            $('.filter-number .remove').click(function(e) {
                $(this).parent().parent().find('input[type="number"]').val('');
            });

            $('.filter-number .toggle').click(function(e) {
                var new_name = $(this).hasClass('active') ? $(this).attr('data-off-name') : $(this).attr('data-on-name');
                $(this).parent().parent().find('input[type="number"]').attr('name', new_name);
            });

            $('#filter-menu form').submit(function() {
                $(this).find('input[type="text"],input[type="number"]').each(function(e) {
                    if (!$(this).val()) $(this).attr('name', '');
                });
                return true;
            });

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
        }
    }
});