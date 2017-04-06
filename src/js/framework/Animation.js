
/**
 * User: remcokrams
 * Date: 01-07-13
 * Time: 13:48
 */


    var time = require('./DateTime').time;

    var exports = {};

    var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })();

    var cancelAnimationFrame = (function () {
        return  window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function (id) {
                window.clearTimeout(id);
            }
    })();

    exports.requestAnimationFrame = function (callback) {
        return requestAnimationFrame(callback);
    }

    exports.cancelAnimationFrame = function (id) {
        cancelAnimationFrame(id);
    }

    var clone = function (obj, dest) {
        for(var prop in obj) if(obj.hasOwnProperty(prop)) {
            dest[prop] = obj[prop];
        }
        return dest;
    }

    /**
     * Creates a new animation object. Which can be used to animate from the values of one object to the values of another object
     * @param {Object} obj The object to animate
     * @param {Boolean} manualUpdate when true a manual call to update is needed to update the interpolated values
     * @returns {{update: update, isFinished: isFinished, to: to, stop: stop}}
     */
    exports.create = function (obj, manualUpdate) {
        var animation = this,
            aniFrame = 0,
            queue = [],
            currentOptions = null,
            firstUpdate = false;

        var nextOptions = function () {
            var fn = queue.shift();
            firstUpdate = true;
            return (currentOptions = (fn ? fn() : null));
        }

        function update() {
            if(!currentOptions) { //no animation started
                return;
            }

            //interpolate the values of the animation
            var options = currentOptions, expired = Math.min(time() - options.startTime, options.duration);

            //not started
            if(expired < 0) {
                if(firstUpdate) {
                    for(var prop in options.from) if(options.from.hasOwnProperty(prop)) {
                        obj[prop] = options.from[prop];
                    }
                }
                if(!manualUpdate) {
                    aniFrame = animation.requestAnimationFrame(update);
                }
            }
            else {
                for(var prop in options.from) if(options.from.hasOwnProperty(prop)) {
                    if(options.duration) {
                        obj[prop] = animation.getValue(options.from[prop], options.to[prop], expired, options.duration, options.ease);
                    }
                    else {
                        obj[prop] = options.to[prop];
                    }
                }
                options.updateCallback(obj);
                if(expired < options.duration) {
                    if(!manualUpdate) {
                        aniFrame = animation.requestAnimationFrame(update);
                    }
                }
                else {
                    options.completeCallback(obj);
                    if(nextOptions()) {
                        if(!manualUpdate) {
                            update();
                        }
                    }
                    else {
                        aniFrame = 0;
                    }
                }
            }

            firstUpdate = false;
        };

        return {
            values : function () {
                return obj;
            },

            /**
             * Manually updates the animation
             */
            update : function () {
                update();
                return this;
            },

            /**
             * Returns true if the animation is finished
             * @returns {boolean}
             */
            isFinished : function () {
                return !currentOptions;
            },

            fromTo : function (fromObj, toObj, options) {
                options = options || {};

                if(typeof options.queue === "undefined") {
                    options.queue = true;
                }

                if(!options.queue) {
                    this.stop();
                }

                queue.push(function () {
                    return {
                        startTime : time() + (options.delay || 0),
                        from : fromObj,
                        to : toObj,
                        ease : options.ease,
                        duration : !isNaN(options.duration*1) ? Math.abs(options.duration) : 500,
                        updateCallback : options.updateCallback || function () {},
                        completeCallback : options.completeCallback || function () {}
                    };
                });

                if(!aniFrame) {
                    nextOptions();
                    if(!manualUpdate) {
                        update();
                    }
                }
                return this;
            },

            from : function (fromObj, options) {
                return this.fromTo(fromObj, clone(obj, {}), options);
            },

            /**
             * Animate to new values
             * @param {Object} toObj an object which contains the new values
             * @param {Object} options
             * @returns {exports}
             */
            to : function (toObj, options) {
                return this.fromTo(clone(obj, {}), toObj, options);
            },

            /**
             * Stop the animation and clears the queue
             * @returns {exports}
             */
            stop : function () {
                if(!manualUpdate) {
                    animation.cancelAnimationFrame(aniFrame);
                    aniFrame = 0;
                }
                queue.length = 0;
                currentOptions = null;
                return this;
            }
        }
    }

    exports.getValue = function (begin, end, time, duration, easing) {
        if(typeof easing === "string") {
            easing = this.easing[easing];
        }
        else if(typeof easing === "undefined") {
            easing = this.easing.linear;
        }
        return easing(Math.min(time, duration), begin, end-begin, duration);
    }

    exports.easing = {
        linear: function (t, b, c, d) {
            return c*t/d + b;
        },
        easeInQuad: function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (t, b, c, d, a, p) {
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * 0.3;
            var s;
            if (!a || a < Math.abs(c))
            {
                a = c;
                s = p / 4;
            }
            else
            {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) *
                Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (t, b, c, d) {
            return c - exports.easing.easeOutBounce (d-t, 0, c, d) + b;
        },
        easeOutBounce: function (t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (t, b, c, d) {
            if (t < d/2) return exports.easing.easeInBounce (t*2, 0, c, d) * .5 + b;
            return exports.easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    }

    return exports;
