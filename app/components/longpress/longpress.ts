angular
    .module('rokort')
    .directive('longpress', function() {
    return {
        restrict: 'A',
        scope: {
            longpress: '&'
        },
        link: function(scope, element) {
            var timer;

            function start() {
                timer = setTimeout(() => {
                    scope.longpress();
                    element.removeClass("long-press");
                }, 500);

                element.addClass("long-press");
            }

            function cancel() {
                clearTimeout(timer);
                element.removeClass("long-press");
            }

            element.on('touchstart', start);
            element.on('mousedown', start);

            document.addEventListener('touchend', cancel);
            document.addEventListener('mouseup', cancel);
        }
    }
});