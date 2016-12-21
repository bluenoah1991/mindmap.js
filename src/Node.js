import _ from 'lodash';
import {Box} from 'box.js';

import Link from './Link';
import Line from './Line';

export default class Node{
    constructor(opts){
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
        this.box = new Box(this.element);
    }

    _calcElementHeight(box){
        let marginTop = box.elementMarginTop();
        let marginBottom = box.elementMarginBottom();
        let height = box.elementHeight();
        return height + marginTop + marginBottom;
    }

    // Position

    _getConnectionPosition(orientation = 'left'){
        let width = this.box.elementWidth();
        let height = this._calcElementHeight(this.box);
        if(orientation == 'left'){
            let x = this.box.x;
            let y = this.box.y + height / 2;
            return [x, y];
        }
    }

    _getLinkPosition(orientation = 'right'){
        let width = this.box.elementWidth();
        let height = this._calcElementHeight(this.box);
        if(orientation == 'right'){
            let x = this.box.x + width + this.linkRadius;
            let y = this.box.y + height / 2;
            return [x, y];
        }
    }

    _getLinkExternalPosition(orientation = 'right'){
        let [x, y] = this._getLinkPosition(orientation);
        if(orientation == 'right'){
            return [x + this.linkRadius, y];
        }
    }

    // Create widget

    _createLink(orientation = 'right'){
        if(this.box.mount && this.link == undefined){
            let [x, y] = this._getLinkPosition(orientation);
            this.link = new Link(this, {
                open: true,
                radius: this.linkRadius,
                color: this.color
            });
            this.box.scene.addBox(this.link.box, x, y, 0);
        }
    }

    _createLine(x1, y1, orientation = 'left'){
        if(this.box.mount && this.line == undefined){
            let [x2, y2] = this._getConnectionPosition(orientation);
            this.line = new Line({
                x1: x1, y1: y1,
                x2: x2, y2: y2,
                color: this.color
            });
            this.box.scene.addBox(this.line.box, 0, 0, -1);
        }
    }

    // Adjust Position

    _calcHeight(){
        let height = 0;
        let nodes = _.filter(this.nodes, function(node){
            return node.isShow();
        });
        if(nodes.length > 0){
            let childHeight = 0
            for(var i in nodes){
                let child = nodes[i];
                childHeight += child._calcHeight();
            }
            childHeight += (nodes.length - 1) * this.gapHeight;
            let currentHeight = this._calcElementHeight(this.box);
            height = childHeight > currentHeight ? childHeight : currentHeight;
        } else {
            height = this._calcElementHeight(this.box);
        }
        return height;
    }

    _calcChildHeight(){
        let height = 0;
        let nodes = _.filter(this.nodes, function(node){
            return node.isShow();
        });
        if(nodes.length > 0){
            for(var i in nodes){
                let child = nodes[i];
                height += child._calcHeight();
            }
            height += (nodes.length - 1) * this.gapHeight;
        }
        return height;
    }

    _adjustPosition(){
        let childHeight = this._calcChildHeight();
        let startX = this.box.x + this.box.elementWidth() + this.gapWidth;
        let centerY = this.box.y + this._calcElementHeight(this.box) / 2;
        let startY = centerY - childHeight / 2;

        let [x1, y1] = this._getLinkExternalPosition();
        
        for(var i in this.nodes){
            let node = this.nodes[i];
            let startY_ = startY + ((node._calcHeight() - this._calcElementHeight(node.box)) / 2);
            node.reset(startX, startY_);
            node._adjustLink();
            node._adjustLine(x1, y1);
            node._adjustPosition();
            startY += node._calcHeight() + this.gapHeight;
        }
    }

    _adjustLink(){
        if(this.link != undefined){
            let [x, y] = this._getLinkPosition();
            this.link.reset(x, y);
        }
    }

    _adjustLine(x1, y1){
        if(this.line != undefined){
            let [x2, y2] = this._getConnectionPosition();
            this.line.reset(x1, y1, x2, y2);
        }
    }

    // Publich Methods

    reset(x, y){
        this.box.setPosition(x, y);
    }

    addChildNode(node){
        // mount node
        this.nodes.push(node);
        if(!node.box.mount){
            this.box.scene.addBox(node.box, 0, 0, 0);
        }
        node.parentNode = this;

        setTimeout(function(){
            // create widget
            this._createLink();
            let [x1, y1] = this._getLinkExternalPosition();
            node._createLine(x1, y1);

            // adjust position
            this._adjustPosition();
            this.box.scene.render();
        }.bind(this), 0);
    }

    open(){
        for(var i in this.nodes){
            let node = this.nodes[i];
            node.box.show();
            if(node.line != undefined){
                node.line.box.show();
            }
            if(node.link != undefined){
                node.link.box.show();
                if(node.link.open){
                    node.link.switch(true);
                    node.open();
                }
            }
        }
        // adjust position
        this.getRootNode()._adjustPosition();
        this.box.scene.render();
    }

    close(){
        for(var i in this.nodes){
            let node = this.nodes[i];
            node.box.hide();
            if(node.link != undefined){
                node.link.box.hide();
            }
            if(node.line != undefined){
                node.line.box.hide();
            }
            node.close();
        }
        // adjust position
        this.getRootNode()._adjustPosition();
        this.box.scene.render();
    }

    isShow(){
        return this.box.show_;
    }

    getRootNode(){
        if(this.parentNode != undefined){
            return this.parentNode.getRootNode();
        } else {
            return this;
        }
    }
}