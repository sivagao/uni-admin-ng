angular.module('uniAdmin.services', [])
    .factory('downloadFile', function() {
        return function downloadFile(url) {
            var iFrame = $('#download-file-iframe');
            if (!iFrame.length) {
                iFrame = $('<iframe id="download-file-iframe" style="position:fixed;display:none;top:-1px;left:-1px;"/>');
                $('body').append(iFrame);
            }
            iFrame.attr('src', url);
        }
    });