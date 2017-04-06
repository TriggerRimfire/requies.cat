
/**
 * User: remcokrams
 * Date: 07-02-13
 * Time: 15:45
 */


    var exports = {};

    exports.MONTHS_NL = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    exports.MONTHS_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    /**
     * Returns the current timestamp in milliseconds on old browsers. On new browsers this will return the timestamp in microseconds
     * Use this to time actions (for example animations)
     * @returns {number}
     */
    exports.time = (function () {
        var performance = window.performance ? (window.performance.now || window.performance.webkitNow || window.performance.mozNow) : null;

        if(performance)
            return performance.bind(window.performance);

        return Date.now || function () {return +new Date();};
    })();

    exports.dateDiff = function (from, to) {
        return new Date( Math.abs( to.valueOf() - from.valueOf() ) );
    }

    /**
     *
     * @param {Number} timestamp
     * @returns {Date}
     */
    exports.parseTimestamp = function (timestamp) {
        return new Date(parseInt(timestamp,10) * 1000);
    }

    /**
     * Use this to parse date strings. The date strings must be in the format: "yyyy-mm-dd hh:mm:ss"
     * @param {string} isoDateString
     * @returns {Date}
     */
    exports.parseIsoDate = function (isoDateString) {
        //Date constructor can not be trusted

        var dateParts = isoDateString.split(" "),
            dateArr = dateParts[0].split("-"),
            timeArr = dateParts.length > 1 ? dateParts[1].split(":") : null;

        var date = new Date();
        date.setDate( parseInt(dateArr[2], 10) );
        date.setMonth( parseInt(dateArr[1], 10) - 1 );
        date.setFullYear( parseInt(dateArr[0], 10) );

        if(timeArr) {
            date.setHours( parseInt(timeArr[0], 10) );
            date.setMinutes( parseInt(timeArr[1], 10) );
            date.setSeconds( parseInt(timeArr[2], 10) );
        }
        else {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
        }

        return date;
    }

    /**
     * Converts the time in seconds to a string in the format: hh:mm:ss
     * @param {number} val
     * @returns {string}
     */
    exports.formatTimeStamp = function (val) {
       val = Math.round(val);
       var hours = (val / 3600) >> 0;
       var mins = ((val / 60) >> 0) % 60;
       var secs = val % 60;
       return (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    };

    /**
     * Converts a Date object to a string in the format: "1 september 2013"
     * @param {Date} date
     * @param {Array.<String>} [monthNames=null] You can pass an array of month names if you need those in a different language.
     * @returns {string}
     */
    exports.getDateLong = function (date, monthNames) {
        if(!(monthNames instanceof Array)) {
            monthNames = exports.MONTHS_NL;
        }
        return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
    };

    /**
     * Converts a Date object to a string in the format: "dd-mm-yyyy"
     * @param {Date} date
     * @param {string} [delimiter="-"]
     * @returns {string}
     */
    exports.getDateShort = function (date, delimiter) {
        if(!delimiter) {
            delimiter = "-";
        }
        var month = date.getMonth()+1;
        var day = date.getDate();
        return ([(day < 10 ? "0"+day : day),(month < 10 ? "0" + month : month), date.getFullYear()]).join(delimiter);
    }

    var postMessageCallbacks = [],
        dirty = false;
        if( window.addEventListener ) {
            window.addEventListener("message", function (e) {
                if(e.source == window && e.data == "nexttick") {
                    for(var i= 0, callback;callback = postMessageCallbacks[i];i++) {
                        callback();
                    }
                    postMessageCallbacks.length = 0;
                    dirty = false;
                }
            });
        }

    /**
     * Delays the action of a function for a very short time
     * @param {function} fn
     */
    exports.nextTick = function (fn) {
        if(typeof window.setImmediate === "function") {
            return window.setImmediate(fn);
        }
        else if(typeof window.postMessage == "function") {
            postMessageCallbacks.push(fn);
            if(!dirty) {
                window.postMessage("nexttick", "*");
                dirty = true;
            }
        }
        else {
            return setTimeout(fn, 0);
        }
    }

    return exports;
