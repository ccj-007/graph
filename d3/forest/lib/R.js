function removeUnderscore(str) {
    return str.replace(/_/g, "");
}
class Raphael {
    // 请挂载在
    constructor(drawArea) {
        console.log("🚀 ~ file: R.js:4 ~ Raphael ~ constructor ~ drawArea:", drawArea)
        this.drawArea = drawArea;
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        this.svg = svg
        this.drawArea.appendChild(svg)
    }

    setSize(width, height) {
        this.width = width || this.width;
        this.height = height || this.height;
        this.svg.setAttribute("width", this.width);
        this.svg.setAttribute("height", this.height);
        return this;
    }
    // 传入path的d参数值，返回svg的节点
    path(pathString) {
        const svgPath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        svgPath.setAttribute("d", removeUnderscore(pathString));
        svgPath.setAttribute("fill", "none");

        this.svg.appendChild(svgPath)

        return {
            attr: this.attr.bind(svgPath),
            show: this.show.bind(svgPath),
            hide: this.hide.bind(svgPath),
            remove: this.remove.bind(svgPath),
            animate: this.animate.bind(svgPath)
        };
    }

    attr(obj) {
        for (let k in obj) {
            this.setAttribute(k, obj[k]);
        }
    }

    animate(params, ms, easing, callback) {
        var len = this.length,
            i = len,
            item,
            set = this,
            collector;

        console.log("🚀 ~ file: forest.js:54 ~ Raphael ~ animate ~ len:", len)

        if (!len) {
            return this;
        }
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = typeof easing === 'string' ? easing : collector;
        var anim = R.animation(params, ms, easing, collector);
        item = this[--i].animate(anim);
        while (i--) {
            this[i] && !this[i].removed && this[i].animateWith(item, anim, anim);
            (this[i] && !this[i].removed) || len--;
        }
        return this;
    }

    // 移除节点
    remove() {
        this.parentNode.removeChild(this);
    }
    show() {
        this.style.display = "block";
    }

    hide() {
        this.style.display = "none";
    }
}
