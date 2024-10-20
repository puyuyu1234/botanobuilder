"use strict";

class TextStyle {
    constructor(size, x, y, sx, sy, color) {
        this.defaultStyle = {
            size: size,
            x: x,
            y: y,
            sx: sx,
            sy: sy,
            color: color,
            bold: false,
            italic: false,
        };
        this.reset();
    }

    applySetting(canvas) {
        const context = canvas.getContext("2d");
        context.font = `${this.bold ? "bold " : ""}${this.italic ? "italic " : ""}${
            this.size
        }px PixelMplus`;
        context.fillStyle = this.color;
    }

    setStyle(key, value) {
        switch (key) {
            case "size":
                this.size = +value;
                break;
            case "color":
                this.color = value;
                break;
            case "italic":
                this.italic = true;
                break;
            case "bold":
                this.bold = true;
                break;
            case "x":
                this.x = +value;
                this.dx = 0;
                break;
            case "y":
                this.y = +value;
                this.dy = 0;
                break;
            case "dx":
                this.dx = +value;
                break;
            case "dy":
                this.dy = +value;
                break;
            case "sx":
                this.sx = +value;
                break;
            case "sy":
                this.sy = +value;
                break;
            case "reset":
                this.reset();
                break;
        }
    }

    reset() {
        this.size = this.defaultStyle.size;
        this.x = this.defaultStyle.x;
        this.y = this.defaultStyle.y;
        this.dx = 0;
        this.dy = 0;
        this.sx = this.defaultStyle.sx;
        this.sy = this.defaultStyle.sy;
        this.color = this.defaultStyle.color;
        this.bold = this.defaultStyle.bold;
        this.italic = this.defaultStyle.italic;
    }

    render(canvas, text, rx, ry) {
        this.applySetting(canvas);
        const context = canvas.getContext("2d");
        text.split("").forEach((c) => {
            context.fillText(c, this.x + this.dx + rx, this.y + this.dy + ry);
            rx += (this.size * getLen(c)) / 2 + this.sx;
        });
    }
}
