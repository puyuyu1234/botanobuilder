"use strict";

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    init() {
        const context = canvas.getContext("2d");
        context.drawImage(assets.get("bg"), 0, 0);
        context.drawImage(assets.get("body"), 0, 0);
        context.drawImage(assets.get(face.value), 0, 0);
        if (effect.value != "none") context.drawImage(assets.get(effect.value), 0, 0);
        if (frame.checked) {
            context.globalCompositeOperation = "multiply";
            context.drawImage(assets.get("frame"), 0, 0);
            context.globalCompositeOperation = "source-over";
            context.drawImage(assets.get("next"), 0, 0, 2039, 300, 0, 0, 2039, 300);
        }
        if (next.checked)
            context.drawImage(assets.get("next"), 0, 1200, 2039, 178, 0, 1200, 2039, 178);
        if (yuri.checked) context.drawImage(assets.get("name"), 0, 0);
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

    render() {
        const currentTextStyle = new TextStyle(
            +fontSize.value,
            +displayX.value,
            +displayY.value,
            +displayCS.value,
            +displayLS.value,
            "white"
        );
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
