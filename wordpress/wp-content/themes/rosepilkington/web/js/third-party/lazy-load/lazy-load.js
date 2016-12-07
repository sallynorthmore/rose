/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */

(function ($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function (options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "original",
            skip_invisible: true,
            appear: null,
            load: null,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function () {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }

        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = settings.container === undefined || settings.container === window ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function () {
                return update();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />").bind("load", function () {

                        var original = $self.attr("data-" + settings.data_attribute);
                        $self.hide();
                        if ($self.is("img")) {
                            $self.attr("src", original);
                        } else {
                            $self.css("background-image", "url('" + original + "')");
                        }
                        $self[settings.effect](settings.effect_speed);

                        self.loaded = true;

                        /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function (element) {
                            return !element.loaded;
                        });
                        elements = $(temp);

                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                    }).attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function () {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function () {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if (/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)) {
            $window.bind("pageshow", function (event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function () {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.leftofbegin = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function (element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold": function (a) {
            return $.belowthefold(a, { threshold: 0 });
        },
        "above-the-top": function (a) {
            return !$.belowthefold(a, { threshold: 0 });
        },
        "right-of-screen": function (a) {
            return $.rightoffold(a, { threshold: 0 });
        },
        "left-of-screen": function (a) {
            return !$.rightoffold(a, { threshold: 0 });
        },
        "in-viewport": function (a) {
            return $.inviewport(a, { threshold: 0 });
        },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function (a) {
            return !$.belowthefold(a, { threshold: 0 });
        },
        "right-of-fold": function (a) {
            return $.rightoffold(a, { threshold: 0 });
        },
        "left-of-fold": function (a) {
            return !$.rightoffold(a, { threshold: 0 });
        }
    });
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy90aGlyZC1wYXJ0eS9sYXp5LWxvYWQvbGF6eS1sb2FkLmpzIl0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsIiR3aW5kb3ciLCJmbiIsImxhenlsb2FkIiwib3B0aW9ucyIsImVsZW1lbnRzIiwiJGNvbnRhaW5lciIsInNldHRpbmdzIiwidGhyZXNob2xkIiwiZmFpbHVyZV9saW1pdCIsImV2ZW50IiwiZWZmZWN0IiwiY29udGFpbmVyIiwiZGF0YV9hdHRyaWJ1dGUiLCJza2lwX2ludmlzaWJsZSIsImFwcGVhciIsImxvYWQiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsImNvdW50ZXIiLCJlYWNoIiwiJHRoaXMiLCJpcyIsImFib3ZldGhldG9wIiwibGVmdG9mYmVnaW4iLCJiZWxvd3RoZWZvbGQiLCJyaWdodG9mZm9sZCIsInRyaWdnZXIiLCJmYWlsdXJlbGltaXQiLCJlZmZlY3RzcGVlZCIsImVmZmVjdF9zcGVlZCIsImV4dGVuZCIsImluZGV4T2YiLCJiaW5kIiwic2VsZiIsIiRzZWxmIiwibG9hZGVkIiwiYXR0ciIsIm9uZSIsImVsZW1lbnRzX2xlZnQiLCJsZW5ndGgiLCJjYWxsIiwib3JpZ2luYWwiLCJoaWRlIiwiY3NzIiwidGVtcCIsImdyZXAiLCJlbGVtZW50IiwidGVzdCIsIm5hdmlnYXRvciIsImFwcFZlcnNpb24iLCJvcmlnaW5hbEV2ZW50IiwicGVyc2lzdGVkIiwicmVhZHkiLCJmb2xkIiwiaW5uZXJIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxUb3AiLCJvZmZzZXQiLCJ0b3AiLCJ3aWR0aCIsInNjcm9sbExlZnQiLCJsZWZ0IiwiaW52aWV3cG9ydCIsImV4cHIiLCJhIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsQ0FBQyxVQUFTQSxDQUFULEVBQVlDLE1BQVosRUFBb0JDLFFBQXBCLEVBQThCQyxTQUE5QixFQUF5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VCxFQUFZO0FBQUUsbUJBQU8sQ0FBQ3BFLEVBQUU2QixXQUFGLENBQWN1QyxDQUFkLEVBQWlCLEVBQUN6RCxXQUFZLENBQWIsRUFBakIsQ0FBUjtBQUE0QztBQVQzRCxLQUF0QjtBQVlILENBbE9ELEVBa09HMEQsTUFsT0gsRUFrT1dwRSxNQWxPWCxFQWtPbUJDLFFBbE9uQiIsImZpbGUiOiJsYXp5LWxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTGF6eSBMb2FkIC0galF1ZXJ5IHBsdWdpbiBmb3IgbGF6eSBsb2FkaW5nIGltYWdlc1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAwNy0yMDEzIE1pa2EgVHV1cG9sYVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqXG4gKiBQcm9qZWN0IGhvbWU6XG4gKiAgIGh0dHA6Ly93d3cuYXBwZWxzaWluaS5uZXQvcHJvamVjdHMvbGF6eWxvYWRcbiAqXG4gKiBWZXJzaW9uOiAgMS45LjNcbiAqXG4gKi9cblxuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgJC5mbi5sYXp5bG9hZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcztcbiAgICAgICAgdmFyICRjb250YWluZXI7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHRocmVzaG9sZCAgICAgICA6IDAsXG4gICAgICAgICAgICBmYWlsdXJlX2xpbWl0ICAgOiAwLFxuICAgICAgICAgICAgZXZlbnQgICAgICAgICAgIDogXCJzY3JvbGxcIixcbiAgICAgICAgICAgIGVmZmVjdCAgICAgICAgICA6IFwic2hvd1wiLFxuICAgICAgICAgICAgY29udGFpbmVyICAgICAgIDogd2luZG93LFxuICAgICAgICAgICAgZGF0YV9hdHRyaWJ1dGUgIDogXCJvcmlnaW5hbFwiLFxuICAgICAgICAgICAgc2tpcF9pbnZpc2libGUgIDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGVhciAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBsb2FkICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgICAgIDogXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNRQUFBN0VBWlVyRGhzQUFBQU5TVVJCVkJoWFl6aDgrUEIvQUFmZkEwbk5QdUNMQUFBQUFFbEZUa1N1UW1DQ1wiXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgICAgICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnNraXBfaW52aXNpYmxlICYmICEkdGhpcy5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuYWJvdmV0aGV0b3AodGhpcywgc2V0dGluZ3MpIHx8XG4gICAgICAgICAgICAgICAgICAgICQubGVmdG9mYmVnaW4odGhpcywgc2V0dGluZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RoaW5nLiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoISQuYmVsb3d0aGVmb2xkKHRoaXMsIHNldHRpbmdzKSAmJlxuICAgICAgICAgICAgICAgICAgICAhJC5yaWdodG9mZm9sZCh0aGlzLCBzZXR0aW5ncykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoXCJhcHBlYXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBpZiB3ZSBmb3VuZCBhbiBpbWFnZSB3ZSdsbCBsb2FkLCByZXNldCB0aGUgY291bnRlciAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCsrY291bnRlciA+IHNldHRpbmdzLmZhaWx1cmVfbGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zKSB7XG4gICAgICAgICAgICAvKiBNYWludGFpbiBCQyBmb3IgYSBjb3VwbGUgb2YgdmVyc2lvbnMuICovXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkICE9PSBvcHRpb25zLmZhaWx1cmVsaW1pdCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZmFpbHVyZV9saW1pdCA9IG9wdGlvbnMuZmFpbHVyZWxpbWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmZhaWx1cmVsaW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgIT09IG9wdGlvbnMuZWZmZWN0c3BlZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmVmZmVjdF9zcGVlZCA9IG9wdGlvbnMuZWZmZWN0c3BlZWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuZWZmZWN0c3BlZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKHNldHRpbmdzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIENhY2hlIGNvbnRhaW5lciBhcyBqUXVlcnkgYXMgb2JqZWN0LiAqL1xuICAgICAgICAkY29udGFpbmVyID0gKHNldHRpbmdzLmNvbnRhaW5lciA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuY29udGFpbmVyID09PSB3aW5kb3cpID8gJHdpbmRvdyA6ICQoc2V0dGluZ3MuY29udGFpbmVyKTtcblxuICAgICAgICAvKiBGaXJlIG9uZSBzY3JvbGwgZXZlbnQgcGVyIHNjcm9sbC4gTm90IG9uZSBzY3JvbGwgZXZlbnQgcGVyIGltYWdlLiAqL1xuICAgICAgICBpZiAoMCA9PT0gc2V0dGluZ3MuZXZlbnQuaW5kZXhPZihcInNjcm9sbFwiKSkge1xuICAgICAgICAgICAgJGNvbnRhaW5lci5iaW5kKHNldHRpbmdzLmV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciAkc2VsZiA9ICQoc2VsZik7XG5cbiAgICAgICAgICAgIHNlbGYubG9hZGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8qIElmIG5vIHNyYyBhdHRyaWJ1dGUgZ2l2ZW4gdXNlIGRhdGE6dXJpLiAqL1xuICAgICAgICAgICAgaWYgKCRzZWxmLmF0dHIoXCJzcmNcIikgPT09IHVuZGVmaW5lZCB8fCAkc2VsZi5hdHRyKFwic3JjXCIpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmICgkc2VsZi5pcyhcImltZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2VsZi5hdHRyKFwic3JjXCIsIHNldHRpbmdzLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFdoZW4gYXBwZWFyIGlzIHRyaWdnZXJlZCBsb2FkIG9yaWdpbmFsIGltYWdlLiAqL1xuICAgICAgICAgICAgJHNlbGYub25lKFwiYXBwZWFyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmFwcGVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzX2xlZnQgPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5hcHBlYXIuY2FsbChzZWxmLCBlbGVtZW50c19sZWZ0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChcIjxpbWcgLz5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbCA9ICRzZWxmLmF0dHIoXCJkYXRhLVwiICsgc2V0dGluZ3MuZGF0YV9hdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNlbGYuaXMoXCJpbWdcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuYXR0cihcInNyY1wiLCBvcmlnaW5hbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCBcInVybCgnXCIgKyBvcmlnaW5hbCArIFwiJylcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmW3NldHRpbmdzLmVmZmVjdF0oc2V0dGluZ3MuZWZmZWN0X3NwZWVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9hZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSBpbWFnZSBmcm9tIGFycmF5IHNvIGl0IGlzIG5vdCBsb29wZWQgbmV4dCB0aW1lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gJC5ncmVwKGVsZW1lbnRzLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhZWxlbWVudC5sb2FkZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMgPSAkKHRlbXApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzX2xlZnQgPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmxvYWQuY2FsbChzZWxmLCBlbGVtZW50c19sZWZ0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3JjXCIsICRzZWxmLmF0dHIoXCJkYXRhLVwiICsgc2V0dGluZ3MuZGF0YV9hdHRyaWJ1dGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyogV2hlbiB3YW50ZWQgZXZlbnQgaXMgdHJpZ2dlcmVkIGxvYWQgb3JpZ2luYWwgaW1hZ2UgKi9cbiAgICAgICAgICAgIC8qIGJ5IHRyaWdnZXJpbmcgYXBwZWFyLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoMCAhPT0gc2V0dGluZ3MuZXZlbnQuaW5kZXhPZihcInNjcm9sbFwiKSkge1xuICAgICAgICAgICAgICAgICRzZWxmLmJpbmQoc2V0dGluZ3MuZXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi50cmlnZ2VyKFwiYXBwZWFyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIENoZWNrIGlmIHNvbWV0aGluZyBhcHBlYXJzIHdoZW4gd2luZG93IGlzIHJlc2l6ZWQuICovXG4gICAgICAgICR3aW5kb3cuYmluZChcInJlc2l6ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBXaXRoIElPUzUgZm9yY2UgbG9hZGluZyBpbWFnZXMgd2hlbiBuYXZpZ2F0aW5nIHdpdGggYmFjayBidXR0b24uICovXG4gICAgICAgIC8qIE5vbiBvcHRpbWFsIHdvcmthcm91bmQuICovXG4gICAgICAgIGlmICgoLyg/OmlwaG9uZXxpcG9kfGlwYWQpLipvcyA1L2dpKS50ZXN0KG5hdmlnYXRvci5hcHBWZXJzaW9uKSkge1xuICAgICAgICAgICAgJHdpbmRvdy5iaW5kKFwicGFnZXNob3dcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnBlcnNpc3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKFwiYXBwZWFyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIEZvcmNlIGluaXRpYWwgY2hlY2sgaWYgaW1hZ2VzIHNob3VsZCBhcHBlYXIuICovXG4gICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKiBDb252ZW5pZW5jZSBtZXRob2RzIGluIGpRdWVyeSBuYW1lc3BhY2UuICAgICAgICAgICAqL1xuICAgIC8qIFVzZSBhcyAgJC5iZWxvd3RoZWZvbGQoZWxlbWVudCwge3RocmVzaG9sZCA6IDEwMCwgY29udGFpbmVyIDogd2luZG93fSkgKi9cblxuICAgICQuYmVsb3d0aGVmb2xkID0gZnVuY3Rpb24oZWxlbWVudCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGZvbGQ7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmNvbnRhaW5lciA9PT0gdW5kZWZpbmVkIHx8IHNldHRpbmdzLmNvbnRhaW5lciA9PT0gd2luZG93KSB7XG4gICAgICAgICAgICBmb2xkID0gKHdpbmRvdy5pbm5lckhlaWdodCA/IHdpbmRvdy5pbm5lckhlaWdodCA6ICR3aW5kb3cuaGVpZ2h0KCkpICsgJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvbGQgPSAkKHNldHRpbmdzLmNvbnRhaW5lcikub2Zmc2V0KCkudG9wICsgJChzZXR0aW5ncy5jb250YWluZXIpLmhlaWdodCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvbGQgPD0gJChlbGVtZW50KS5vZmZzZXQoKS50b3AgLSBzZXR0aW5ncy50aHJlc2hvbGQ7XG4gICAgfTtcblxuICAgICQucmlnaHRvZmZvbGQgPSBmdW5jdGlvbihlbGVtZW50LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9sZDtcblxuICAgICAgICBpZiAoc2V0dGluZ3MuY29udGFpbmVyID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuY29udGFpbmVyID09PSB3aW5kb3cpIHtcbiAgICAgICAgICAgIGZvbGQgPSAkd2luZG93LndpZHRoKCkgKyAkd2luZG93LnNjcm9sbExlZnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvbGQgPSAkKHNldHRpbmdzLmNvbnRhaW5lcikub2Zmc2V0KCkubGVmdCArICQoc2V0dGluZ3MuY29udGFpbmVyKS53aWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvbGQgPD0gJChlbGVtZW50KS5vZmZzZXQoKS5sZWZ0IC0gc2V0dGluZ3MudGhyZXNob2xkO1xuICAgIH07XG5cbiAgICAkLmFib3ZldGhldG9wID0gZnVuY3Rpb24oZWxlbWVudCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGZvbGQ7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmNvbnRhaW5lciA9PT0gdW5kZWZpbmVkIHx8IHNldHRpbmdzLmNvbnRhaW5lciA9PT0gd2luZG93KSB7XG4gICAgICAgICAgICBmb2xkID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvbGQgPSAkKHNldHRpbmdzLmNvbnRhaW5lcikub2Zmc2V0KCkudG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvbGQgPj0gJChlbGVtZW50KS5vZmZzZXQoKS50b3AgKyBzZXR0aW5ncy50aHJlc2hvbGQgICsgJChlbGVtZW50KS5oZWlnaHQoKTtcbiAgICB9O1xuXG4gICAgJC5sZWZ0b2ZiZWdpbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBmb2xkO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5jb250YWluZXIgPT09IHVuZGVmaW5lZCB8fCBzZXR0aW5ncy5jb250YWluZXIgPT09IHdpbmRvdykge1xuICAgICAgICAgICAgZm9sZCA9ICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9sZCA9ICQoc2V0dGluZ3MuY29udGFpbmVyKS5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvbGQgPj0gJChlbGVtZW50KS5vZmZzZXQoKS5sZWZ0ICsgc2V0dGluZ3MudGhyZXNob2xkICsgJChlbGVtZW50KS53aWR0aCgpO1xuICAgIH07XG5cbiAgICAkLmludmlld3BvcnQgPSBmdW5jdGlvbihlbGVtZW50LCBzZXR0aW5ncykge1xuICAgICAgICAgcmV0dXJuICEkLnJpZ2h0b2Zmb2xkKGVsZW1lbnQsIHNldHRpbmdzKSAmJiAhJC5sZWZ0b2ZiZWdpbihlbGVtZW50LCBzZXR0aW5ncykgJiZcbiAgICAgICAgICAgICAgICAhJC5iZWxvd3RoZWZvbGQoZWxlbWVudCwgc2V0dGluZ3MpICYmICEkLmFib3ZldGhldG9wKGVsZW1lbnQsIHNldHRpbmdzKTtcbiAgICAgfTtcblxuICAgIC8qIEN1c3RvbSBzZWxlY3RvcnMgZm9yIHlvdXIgY29udmVuaWVuY2UuICAgKi9cbiAgICAvKiBVc2UgYXMgJChcImltZzpiZWxvdy10aGUtZm9sZFwiKS5zb21ldGhpbmcoKSBvciAqL1xuICAgIC8qICQoXCJpbWdcIikuZmlsdGVyKFwiOmJlbG93LXRoZS1mb2xkXCIpLnNvbWV0aGluZygpIHdoaWNoIGlzIGZhc3RlciAqL1xuXG4gICAgJC5leHRlbmQoJC5leHByW1wiOlwiXSwge1xuICAgICAgICBcImJlbG93LXRoZS1mb2xkXCIgOiBmdW5jdGlvbihhKSB7IHJldHVybiAkLmJlbG93dGhlZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICBcImFib3ZlLXRoZS10b3BcIiAgOiBmdW5jdGlvbihhKSB7IHJldHVybiAhJC5iZWxvd3RoZWZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgXCJyaWdodC1vZi1zY3JlZW5cIjogZnVuY3Rpb24oYSkgeyByZXR1cm4gJC5yaWdodG9mZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICBcImxlZnQtb2Ytc2NyZWVuXCIgOiBmdW5jdGlvbihhKSB7IHJldHVybiAhJC5yaWdodG9mZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICBcImluLXZpZXdwb3J0XCIgICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiAkLmludmlld3BvcnQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgLyogTWFpbnRhaW4gQkMgZm9yIGNvdXBsZSBvZiB2ZXJzaW9ucy4gKi9cbiAgICAgICAgXCJhYm92ZS10aGUtZm9sZFwiIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gISQuYmVsb3d0aGVmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIFwicmlnaHQtb2YtZm9sZFwiICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICQucmlnaHRvZmZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgXCJsZWZ0LW9mLWZvbGRcIiAgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gISQucmlnaHRvZmZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfVxuICAgIH0pO1xuXG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuIl19