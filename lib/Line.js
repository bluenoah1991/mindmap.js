'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _box = require('box.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = function () {
    function Line(opts) {
        _classCallCheck(this, Line);

        this.opts = opts || {};
        this.x1 = this.opts.x1 || 0;
        this.y1 = this.opts.y1 || 0;
        this.x2 = this.opts.x2 || 0;
        this.y2 = this.opts.y2 || 0;
        this.curvature = this.opts.curvature || 20;
        this.color = this.opts.color || 'lightskyblue';
        this.box = new _box.Box(this.render.bind(this));
    }

    _createClass(Line, [{
        key: 'reset',
        value: function reset(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            var path = ctx.createPath();
            ctx.setStrokeStyle(this.color);
            path.moveTo(this.x1, this.y1);
            var cp1x = this.x1 > this.x2 ? this.x1 - this.curvature : this.x1 + this.curvature;
            var cp1y = this.y1;
            var cp2x = this.x1 > this.x2 ? this.x2 + this.curvature : this.x2 - this.curvature;
            var cp2y = this.y2;
            path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, this.x2, this.y2);
            ctx.stroke(path);
        }
    }]);

    return Line;
}();

exports.default = Line;
//# sourceMappingURL=Line.js.map