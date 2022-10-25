export class MiChart {

    constructor(canvas, {
        type,
        slider,
        data,
        asynCallback,
        rows_count,
    }) {

        
        this.data = data;
        this.canvas = canvas;

        this.ctx = canvas.getContext('2d');

        this.rows_count = rows_count ? rows_count : 6;
        
        this.padding = 40;
        this.dpi_width = canvas.offsetWidth * 2;
        this.dpi_height = canvas.offsetHeight * 2;
        this.height_viewport = this.dpi_height - this.padding * 2;

        canvas.width = this.dpi_width;
        canvas.height = this.dpi_height;


        this.init();
    }


    init() {

        
        const [min, max] = this.range;

        const yRatio = this.height_viewport / (max.y - min.y);
        const xRatio = this.dpi_width / (max.x - min.x);

        const step = this.height_viewport / this.rows_count;
        const textStep = (max.y - min.y) / this.rows_count;

        this.ctx.beginPath();

        this.ctx.strokeStyle = '#bbb';
        this.ctx.font = 'normal 1.3em Helvetica, sans-serif'
        this.ctx.fillStyle = '#96a2aa';

        for(let i = 1; i <= this.rows_count; i++) {
            const y = step * i;
            const text = Math.round( max.y - textStep * i);
            this.ctx.fillText(text.toString(), 5, y + this.padding - 10);
            this.ctx.moveTo(0, y + this.padding);
            this.ctx.lineTo(this.dpi_width, y + this.padding)
        }
 
        this.ctx.stroke();

        this.ctx.closePath();


        this.ctx.beginPath();


        const xStep = this.dpi_width / this.data.length;

        console.log(xStep)
        


        for(let index=0; index < this.data.length; index++) {


            const { label } = this.data[index];

            this.ctx.fillText(label, xStep * index, this.dpi_height - 10);

        }


        this.ctx.closePath();


        this.ctx.beginPath();

        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#ff0000';

        for(const {x, y} of this.data) {
            this.ctx.lineTo(x * xRatio, this.dpi_height - this.padding - y * yRatio);
        }
 
        
        this.ctx.stroke()
        this.ctx.closePath();

    }


    get range() {

        let minX, maxX, minY, maxY;

        for(let {x, y} of this.data) {

            if(typeof minY !== 'number') minY = y;
            if(typeof maxY !== 'number') maxY = y;
            if(typeof minX !== 'number') minX = x;
            if(typeof maxX !== 'number') maxX = x;

            if(minY > y) minY = y;
            if(maxY < y) maxY = y;

            if(minX > x) minX = x;
            if(maxX < x) maxX = x;

        }
        
        return [ {x: minX, y: minY}, {x: maxX, y: maxY} ];
    }

}