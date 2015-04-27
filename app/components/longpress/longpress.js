app.directive('longpress', function() {
    return {
        scope: {
            longpress: '&'
        },
        link: function(scope, element) {
            var timer;
            element = element[0];

            function start() {
                timer = setTimeout(function() {
                    scope.longpress();
                    element.classList.remove("long-press");
                }, 500);

                element.classList.add("long-press");
            }

            function cancel() {
                clearTimeout(timer);
                element.classList.remove("long-press");
            }

            element.addEventListener('touchstart', start);
            document.addEventListener('touchend', cancel);
            element.addEventListener('mousedown', start);
            document.addEventListener('mouseup', cancel);
        }
    }
});