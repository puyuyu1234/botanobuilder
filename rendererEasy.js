"use strict";

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    init() {
        const context = canvas.getContext("2d");
        context.drawImage(assets.get("bg"), 0, 0);
        context.drawImage(assets.get("body"), 0, 0);
        context.drawImage(assets.get(activeFaceValue), 0, 0);
        if (activeEffectValue != "none") context.drawImage(assets.get(activeEffectValue), 0, 0);

        context.globalCompositeOperation = "multiply";
        context.drawImage(assets.get("frame"), 0, 0);
        context.globalCompositeOperation = "source-over";
        context.drawImage(assets.get("next"), 0, 0, 2039, 300, 0, 0, 2039, 300);
        context.drawImage(assets.get("next"), -300, 1200, 2039, 178, 0, 1200, 2039, 178);
        context.drawImage(assets.get("name"), 0, 0);
    }

    processText(text) {
        const textArray = text.split("\n");
        const result = [];
        textArray.forEach((str) => {
            const stringParts = [];
            const regex = /\[font [^\]]+\]/g;

            // [font ]コマンドで分割
            {
                let match;
                let lastIndex = 0;
                while ((match = regex.exec(str)) !== null) {
                    const startIndex = match.index;
                    const endIndex = match.index + match[0].length;
                    stringParts.push(str.slice(lastIndex, startIndex));
                    stringParts.push(str.slice(startIndex, endIndex));
                    lastIndex = regex.lastIndex;
                }
                if (lastIndex < str.length) {
                    stringParts.push(str.slice(lastIndex));
                }
            }

            stringParts.forEach((part) => {
                if (regex.exec(part)) {
                    // font
                    const fontArray = part.slice(0, -1).split(" ");
                    for (let i = 1; i < fontArray.length; i++) {
                        const commands = fontArray[i].split("=");
                        result.push(["font", ...commands]);
                    }
                } else {
                    // 文章
                    result.push(["text", part]);
                }
            });
            result.push(["endLine"]);
        });

        return result;
    }

    calcTextStyle() {
        // テキストの量を計算する
        const textData = text.value.split("\n").map((s) => getLen(s));
        const maxLength = textData.reduce((a, b) => (a > b ? a : b)) / 2;
        // 縦240くらいなのでそれを基準にしてサイズ計算
        // width="2039" height="1378"
        // 横幅は300-1700くらいが限界か？
        const sx = 0;
        const sy = 20;
        const y = 1120;
        const sizeX = 1400 / maxLength - sx;
        const sizeY = 240 / textData.length - sy;
        const size = Math.min(sizeX, sizeY);
        const x = 300;
        return new TextStyle(size, x, y, sx, sy, "white");
    }

    render() {
        const currentTextStyle = this.calcTextStyle();
        this.init();

        let y = 0;
        const textData = this.processText(text.value);
        textData.forEach((data) => {
            let x = 0;
            switch (data[0]) {
                case "font":
                    currentTextStyle.setStyle(data[1], data[2]);
                    break;
                case "text":
                    x = currentTextStyle.render(this.canvas, data[1], x, y);
                    break;
                case "endLine":
                    x = 0;
                    y += currentTextStyle.size + currentTextStyle.sy;
                    break;
            }
        });
    }
}
