'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _box = require('box.js');

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node(opts) {
        _classCallCheck(this, Node);

        this.nodes = [];
        this.parentNode = null;
        this.link = null;
        // from parent node to this node
        this.line = null;

        // Options
        this.opts = opts || {};
        this.element = this.opts.element || $('<h1>Node</h1>');
        this.linkRadius = this.opts.linkRadius || 8;
        this.gapWidth = this.opts.gapWidth || 50;
        this.gapHeight = this.opts.gapHeight || 30;
        this.color = this.opts.color || 'lightskyblue';
        this.box = new _box.Box(this.element);
    }

    _createClass(Node, [{
        key: '_calcElementHeight',
        value: function _calcElementHeight(box) {
            var marginTop = box.elementMarginTop();
            var marginBottom = box.elementMarginBottom();
            var height = box.elementHeight();
            return height + marginTop + marginBottom;
        }

        // Position

    }, {
        key: '_getConnectionPosition',
        value: function _getConnectionPosition() {
            var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'left';

            var width = this.box.elementWidth();
            var height = this._calcElementHeight(this.box);
            if (orientation == 'left') {
                var x = this.box.x;
                var y = this.box.y + height / 2;
                return [x, y];
            }
        }
    }, {
        key: '_getLinkPosition',
        value: function _getLinkPosition() {
            var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';

            var width = this.box.elementWidth();
            var height = this._calcElementHeight(this.box);
            if (orientation == 'right') {
                var x = this.box.x + width + this.linkRadius;
                var y = this.box.y + height / 2;
                return [x, y];
            }
        }
    }, {
        key: '_getLinkExternalPosition',
        value: function _getLinkExternalPosition() {
            var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';

            var _getLinkPosition2 = this._getLinkPosition(orientation),
                _getLinkPosition3 = _slicedToArray(_getLinkPosition2, 2),
                x = _getLinkPosition3[0],
                y = _getLinkPosition3[1];

            if (orientation == 'right') {
                return [x + this.linkRadius, y];
            }
        }

        // Create widget

    }, {
        key: '_createLink',
        value: function _createLink() {
            var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';

            if (this.box.mount && this.link == undefined) {
                var _getLinkPosition4 = this._getLinkPosition(orientation),
                    _getLinkPosition5 = _slicedToArray(_getLinkPosition4, 2),
                    x = _getLinkPosition5[0],
                    y = _getLinkPosition5[1];

                this.link = new _Link2.default(this, {
                    open: true,
                    radius: this.linkRadius,
                    color: this.color
                });
                this.box.scene.addBox(this.link.box, x, y, 0);
            }
        }
    }, {
        key: '_createLine',
        value: function _createLine(x1, y1) {
            var orientation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';

            if (this.box.mount && this.line == undefined) {
                var _getConnectionPositio = this._getConnectionPosition(orientation),
                    _getConnectionPositio2 = _slicedToArray(_getConnectionPositio, 2),
                    x2 = _getConnectionPositio2[0],
                    y2 = _getConnectionPositio2[1];

                this.line = new _Line2.default({
                    x1: x1, y1: y1,
                    x2: x2, y2: y2,
                    color: this.color
                });
                this.box.scene.addBox(this.line.box, 0, 0, -1);
            }
        }

        // Adjust Position

    }, {
        key: '_calcHeight',
        value: function _calcHeight() {
            var height = 0;
            var nodes = _lodash2.default.filter(this.nodes, function (node) {
                return node.isShow();
            });
            if (nodes.length > 0) {
                var childHeight = 0;
                for (var i in nodes) {
                    var child = nodes[i];
                    childHeight += child._calcHeight();
                }
                childHeight += (nodes.length - 1) * this.gapHeight;
                var currentHeight = this._calcElementHeight(this.box);
                height = childHeight > currentHeight ? childHeight : currentHeight;
            } else {
                height = this._calcElementHeight(this.box);
            }
            return height;
        }
    }, {
        key: '_calcChildHeight',
        value: function _calcChildHeight() {
            var height = 0;
            var nodes = _lodash2.default.filter(this.nodes, function (node) {
                return node.isShow();
            });
            if (nodes.length > 0) {
                for (var i in nodes) {
                    var child = nodes[i];
                    height += child._calcHeight();
                }
                height += (nodes.length - 1) * this.gapHeight;
            }
            return height;
        }
    }, {
        key: '_adjustPosition',
        value: function _adjustPosition() {
            var childHeight = this._calcChildHeight();
            var startX = this.box.x + this.box.elementWidth() + this.gapWidth;
            var centerY = this.box.y + this._calcElementHeight(this.box) / 2;
            var startY = centerY - childHeight / 2;

            var _getLinkExternalPosit = this._getLinkExternalPosition(),
                _getLinkExternalPosit2 = _slicedToArray(_getLinkExternalPosit, 2),
                x1 = _getLinkExternalPosit2[0],
                y1 = _getLinkExternalPosit2[1];

            for (var i in this.nodes) {
                var node = this.nodes[i];
                var startY_ = startY + (node._calcHeight() - this._calcElementHeight(node.box)) / 2;
                node.reset(startX, startY_);
                node._adjustLink();
                node._adjustLine(x1, y1);
                node._adjustPosition();
                startY += node._calcHeight() + this.gapHeight;
            }
        }
    }, {
        key: '_adjustLink',
        value: function _adjustLink() {
            if (this.link != undefined) {
                var _getLinkPosition6 = this._getLinkPosition(),
                    _getLinkPosition7 = _slicedToArray(_getLinkPosition6, 2),
                    x = _getLinkPosition7[0],
                    y = _getLinkPosition7[1];

                this.link.reset(x, y);
            }
        }
    }, {
        key: '_adjustLine',
        value: function _adjustLine(x1, y1) {
            if (this.line != undefined) {
                var _getConnectionPositio3 = this._getConnectionPosition(),
                    _getConnectionPositio4 = _slicedToArray(_getConnectionPositio3, 2),
                    x2 = _getConnectionPositio4[0],
                    y2 = _getConnectionPositio4[1];

                this.line.reset(x1, y1, x2, y2);
            }
        }

        // Publich Methods

    }, {
        key: 'reset',
        value: function reset(x, y) {
            this.box.setPosition(x, y);
        }
    }, {
        key: 'addChildNode',
        value: function addChildNode(node) {
            // mount node
            this.nodes.push(node);
            if (!node.box.mount) {
                this.box.scene.addBox(node.box, 0, 0, 0);
            }
            node.parentNode = this;

            setTimeout(function () {
                // create widget
                this._createLink();

                var _getLinkExternalPosit3 = this._getLinkExternalPosition(),
                    _getLinkExternalPosit4 = _slicedToArray(_getLinkExternalPosit3, 2),
                    x1 = _getLinkExternalPosit4[0],
                    y1 = _getLinkExternalPosit4[1];

                node._createLine(x1, y1);

                // adjust position
                this._adjustPosition();
                this.box.scene.render();
            }.bind(this), 0);
        }
    }, {
        key: 'open',
        value: function open() {
            for (var i in this.nodes) {
                var node = this.nodes[i];
                node.box.show();
                if (node.line != undefined) {
                    node.line.box.show();
                }
                if (node.link != undefined) {
                    node.link.box.show();
                    if (node.link.open) {
                        node.link.switch(true);
                        node.open();
                    }
                }
            }
            // adjust position
            this.getRootNode()._adjustPosition();
            this.box.scene.render();
        }
    }, {
        key: 'close',
        value: function close() {
            for (var i in this.nodes) {
                var node = this.nodes[i];
                node.box.hide();
                if (node.link != undefined) {
                    node.link.box.hide();
                }
                if (node.line != undefined) {
                    node.line.box.hide();
                }
                node.close();
            }
            // adjust position
            this.getRootNode()._adjustPosition();
            this.box.scene.render();
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            return this.box.show_;
        }
    }, {
        key: 'getRootNode',
        value: function getRootNode() {
            if (this.parentNode != undefined) {
                return this.parentNode.getRootNode();
            } else {
                return this;
            }
        }
    }]);

    return Node;
}();

exports.default = Node;
//# sourceMappingURL=Node.js.map