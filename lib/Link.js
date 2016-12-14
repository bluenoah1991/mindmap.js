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

var Link = function () {
    function Link(node, opts) {
        _classCallCheck(this, Link);

        this.node = node;

        this.opts = opts || {};
        this.radius = opts.radius || 8;
        this.open = this.opts.open || true;

        this.box = new _box.Box(this.render.bind(this));
        this.box.onMouseDown = this.onMouseDown.bind(this);
    }

    _createClass(Link, [{
        key: 'reset',
        value: function reset(x, y) {
            this.box.setPosition(x, y);
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            var path = ctx.createPath();
            ctx.setStrokeStyle('lightskyblue');
            path.ellipse(0, 0, this.radius, this.radius, 0, 0, 2 * Math.PI);
            path.moveTo(2 - this.radius, 0);
            path.lineTo(this.radius - 2, 0);
            if (!this.open) {
                path.moveTo(0, 2 - this.radius);
                path.lineTo(0, this.radius - 2);
            }
            ctx.stroke(path);
        }
    }, {
        key: 'switch',
        value: function _switch(val) {
            if (val == undefined) {
                this.open = !this.open;
            } else {
                this.open = val;
            }
            this.box.scene.render();
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e, x, y) {
            this.switch();
            if (this.open) {
                this.node.open();
            } else {
                this.node.close();
            }
        }
    }]);

    return Link;
}();

exports.default = Link;
//# sourceMappingURL=Link.js.map