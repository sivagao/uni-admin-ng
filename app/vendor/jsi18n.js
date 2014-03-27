(function(globals) {

    var django = globals.django || (globals.django = {});


    django.pluralidx = function(n) {
        var v = 0;
        if (typeof(v) == 'boolean') {
            return v ? 1 : 0;
        } else {
            return v;
        }
    };



    /* gettext library */

    django.catalog = {
        "%(sel)s of %(cnt)s selected": [
            "\u9009\u4e2d\u4e86 %(cnt)s \u4e2a\u4e2d\u7684 %(sel)s \u4e2a"
        ],
        "%T": "%T",
        "AM PM": "\u4e0a\u5348 \u4e0b\u5348",
        "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec": "\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00 \u5341\u4e8c",
        "January February March April May June July August September October November December": "\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708",
        "New Item": "\u65b0\u9879\u76ee",
        "Su Mo Tu We Th Fr Sa Su": "\u65e5 \u4e00 \u4e8c \u4e09 \u56db \u4e94 \u516d",
        "Sun Mon Tue Wed Thu Fri Sat Sun": "\u65e5 \u4e00 \u4e8c \u4e09 \u56db \u4e94 \u516d",
        "Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday": "\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d",
        "Today": "\u4eca\u5929",
        "am pm": "\u4e0a\u5348 \u4e0b\u5348"
    };

    django.gettext = function(msgid) {
        var value = django.catalog[msgid];
        if (typeof(value) == 'undefined') {
            return msgid;
        } else {
            return (typeof(value) == 'string') ? value : value[0];
        }
    };

    django.ngettext = function(singular, plural, count) {
        var value = django.catalog[singular];
        if (typeof(value) == 'undefined') {
            return (count == 1) ? singular : plural;
        } else {
            return value[django.pluralidx(count)];
        }
    };

    django.gettext_noop = function(msgid) {
        return msgid;
    };

    django.pgettext = function(context, msgid) {
        var value = django.gettext(context + '\x04' + msgid);
        if (value.indexOf('\x04') != -1) {
            value = msgid;
        }
        return value;
    };

    django.npgettext = function(context, singular, plural, count) {
        var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
        if (value.indexOf('\x04') != -1) {
            value = django.ngettext(singular, plural, count);
        }
        return value;
    };


    django.interpolate = function(fmt, obj, named) {
        if (named) {
            return fmt.replace(/%\(\w+\)s/g, function(match) {
                return String(obj[match.slice(2, -2)])
            });
        } else {
            return fmt.replace(/%s/g, function(match) {
                return String(obj.shift())
            });
        }
    };


    /* formatting library */

    django.formats = {
        "DATETIME_FORMAT": "Y-m-d H:i",
        "DATETIME_INPUT_FORMATS": [
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d %H:%M:%S.%f",
            "%Y-%m-%d %H:%M",
            "%Y-%m-%d",
            "%m/%d/%Y %H:%M:%S",
            "%m/%d/%Y %H:%M:%S.%f",
            "%m/%d/%Y %H:%M",
            "%m/%d/%Y",
            "%m/%d/%y %H:%M:%S",
            "%m/%d/%y %H:%M:%S.%f",
            "%m/%d/%y %H:%M",
            "%m/%d/%y"
        ],
        "DATE_FORMAT": "Y-m-d",
        "DATE_INPUT_FORMATS": [
            "%Y-%m-%d",
            "%m/%d/%Y",
            "%m/%d/%y",
            "%b %d %Y",
            "%b %d, %Y",
            "%d %b %Y",
            "%d %b, %Y",
            "%B %d %Y",
            "%B %d, %Y",
            "%d %B %Y",
            "%d %B, %Y"
        ],
        "DECIMAL_SEPARATOR": ".",
        "FIRST_DAY_OF_WEEK": "0",
        "MONTH_DAY_FORMAT": "F j",
        "NUMBER_GROUPING": "0",
        "SHORT_DATETIME_FORMAT": "m/d/Y P",
        "SHORT_DATE_FORMAT": "m/d/Y",
        "THOUSAND_SEPARATOR": ",",
        "TIME_FORMAT": "H:i",
        "TIME_INPUT_FORMATS": [
            "%H:%M:%S",
            "%H:%M:%S.%f",
            "%H:%M"
        ],
        "YEAR_MONTH_FORMAT": "F Y"
    };

    django.get_format = function(format_type) {
        var value = django.formats[format_type];
        if (typeof(value) == 'undefined') {
            return format_type;
        } else {
            return value;
        }
    };

    /* add to global namespace */
    globals.pluralidx = django.pluralidx;
    globals.gettext = django.gettext;
    globals.ngettext = django.ngettext;
    globals.gettext_noop = django.gettext_noop;
    globals.pgettext = django.pgettext;
    globals.npgettext = django.npgettext;
    globals.interpolate = django.interpolate;
    globals.get_format = django.get_format;

}(this));