import _ from 'lodash';
import {Box} from 'box.js';

export default class Line{
    constructor(opts){
        this.opts = opts || {};
        this.x1 = this.opts.x1 || 0;
        this.y1 = this.opts.y1 || 0;
        this.x2 = this.opts.x2 || 0;
        this.y2 = this.opts.y2 || 0;
        this.curvature = this.opts.curvature || 20;
        this.color = this.opts.color || 'lightskyblue';
        this.box = new Box(this.render.bind(this));
    }

    reset(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    render(ctx){
        let path = ctx.createPath();
        ctx.setStrokeStyle(this.color);
        path.moveTo(this.x1, this.y1);
        let cp1x = this.x1 > this.x2 ? this.x1 - this.curvature : this.x1 + this.curvature;
        let cp1y = this.y1;
        let cp2x = this.x1 > this.x2 ? this.x2 + this.curvature : this.x2 - this.curvature;
        let cp2y = this.y2;
        path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, this.x2, this.y2);
        ctx.stroke(path);
    }
}