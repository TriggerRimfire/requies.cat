var Point = function (x,y) {
        this.set(x,y);
    }

    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    }

    Point.prototype.isEmpty = function () {
        return this.x === 0 && this.y === 0;
    }

    Point.prototype.set = function (x,y) {
        if(typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x || 0;
            this.y = y || 0;
        }
        return this;
    }

    Point.prototype.equals = function (otherPoint) {
        return otherPoint ? otherPoint === this || (this.x === otherPoint.x && this.y === otherPoint.y) : false;
    }

    Point.prototype.length = function () {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    Point.prototype.distanceTo = function (otherPoint) {
        var distX = otherPoint.x - this.x,
            distY = otherPoint.y - this.y;
        return Math.sqrt(distX*distX + distY*distY);
    }

    Point.prototype.rotationBetween = function (otherPoint, beginAngle) {
        var circle = Math.PI*2,
            angle = Math.atan2(otherPoint.y - this.y, otherPoint.x - this.x) + (Math.PI/2);

        if(beginAngle !== undefined)
        {
          angle = (angle + circle) % circle;
          beginAngle = (beginAngle + circle) % circle;

          var a = angle - beginAngle, b = (angle-circle) - beginAngle, c = angle - (beginAngle-circle);

          if(Math.abs(b) < Math.abs(c))
            return b;
          return Math.min(a,b,c);
        }

        return angle;
    }

    Point.prototype.rotate = function (angle) {
        this.x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        this.y = (this.y * Math.cos(angle)) + (this.x * Math.sin(angle));
        return this;
    }

    Point.prototype.normalize = function () {
        var len = this.length();
        if(len > 0.00001) {
            this.x /= len; this.y /= len;
        }
        else {
            this.x = this.y = 0;
        }
        return this;
    }

    Point.prototype.offset = function (x, y) {
        this.x += x; this.y += y;
        return this;
    }

    Point.prototype.offsetPoint = function (point) {
        this.x += point.x; this.y += point.y;
        return this;
    }

    Point.prototype.toString = function() {
        return "Point(" + this.x + "," + this.y + ")";
    }

module.exports = Point
