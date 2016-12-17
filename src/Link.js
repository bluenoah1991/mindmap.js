import _ from 'lodash';
import {Box} from 'box.js';

export default class Link{
    constructor(node, opts){
        this.node = node;

        this.opts = opts || {};
        this.radius = opts.radius || 8;
        this.open = this.opts.open || true;

        this.box = new Box(this.render.bind(this));
        this.box.onMouseDown = this.onTouch.bind(this);
        this.box.onTouchStart = this.onTouch.bind(this)
    }

    reset(x, y){
        this.box.setPosition(x, y);
    }

    render(ctx){
        let path = ctx.createPath();
        ctx.setStrokeStyle('lightskyblue');
        path.ellipse(0, 0, this.radius, this.radius, 0, 0, 2 * Math.PI);
        path.moveTo(2 - this.radius, 0);
        path.lineTo(this.radius - 2, 0);
        if(!this.open){
            path.moveTo(0, 2 - this.radius);
            path.lineTo(0, this.radius - 2);
        }
        ctx.stroke(path);
    }

    switch(val){
        if(val == undefined){
            this.open = !this.open;
        } else {
            this.open = val;
        }
        this.box.scene.render();
    }

    onTouch(e, x, y){
        this.switch();
        if(this.open){
            this.node.open();
        } else {
            this.node.close();
        }
    }
}