class Elem {
    constructor() {
        const cns = [],
            ctx = [];
        for (let i = 0; i < 3; ++i) {
            cns.push(document.getElementById('cns' + (i + 1).toString()));
            ctx.push(cns[i].getContext('2d'));
        }
        this.cns = cns;
        this.ctx = ctx;
    }
    // ---------------
    // canvas func
    // ---------------
    getCnsWidth(index) {
        return this.cns[index - 1].width;
    }

    getCnsHeight(index) {
        return this.cns[index - 1].height;
    }

    setCns(index, w, h) {
        this.cns[index - 1].width = w;
        this.cns[index - 1].height = h;
    }

    getCns(index) {
        return this.cns[index - 1];
    }

    getCtx(index) {
        return this.ctx[index - 1];
    }

    // draw func
    clearCns(index) {
        this.ctx[index - 1].clearRect(0, 0, this.cns[index - 1].width, this.cns[index - 1].height);
    }
    rendImg(index, img, w, h, need_resize) {
        if (need_resize) this.setCns(index, w, h);
        this.clearCns(index);
        this.ctx[index - 1].drawImage(img, 0, 0, w, h);
    }

    rendImgData(index, imgData) {
        this.ctx[index - 1].putImageData(imgData, 0, 0);
    }

    resizeAndDrawCns() {
        let scale = this.callConfig().img_scale,
            w = img.width,
            h = img.height,
            l_cns_i = 1,
            cns_i = 1,
            cnt = 1;
        do {
            if (cnt == 1) this.rendImg(cns_i, img, w, h, true); // first
            else this.rendImg(cns_i, this.cns[l_cns_i - 1], w, h, true);
            l_cns_i = cns_i;
            cns_i = (cns_i == 1) ? 2 : 1;
            if (cnt++ >= 1) {
                w /= 2;
                h /= 2;
            }
        } while (cnt <= scale /*w > window.innerWidth || h > window.innerHeight*/ );

        if (l_cns_i == 1) {
            this.rendImg(2, this.cns[0], w, h, true);
            this.rendImg(1, this.cns[1], w, h, true);
        } else {
            this.rendImg(1, this.cns[1], w, h, true);
            this.rendImg(2, this.cns[0], w, h, true);
        }
        this.clearCns(2);
        this.rendImg(3, this.cns[0], 1, 1, true);
    }

    // slider func
    chgImgSize() {
        let v = document.getElementById(ID.slider).value;
        switch (v) {
            case '1':
                v = 1;
                break;
            case '2':
                v = 0.5;
                break;
            case '3':
                v = 0.25;
                break;
            case '4':
                v = 0.125;
                break;
            case '5':
                v = 0.0625;
                break;
        }
        document.getElementById(ID.slider_text).innerHTML = v + '&nbsp;';
    }

    chgXYSize() {
        let v = document.getElementById(ID.xy_slider).value;
        document.getElementById(ID.xy_slider_text).innerHTML = v + '&nbsp;';
    }

    // set at app construct
    callConfig() {}
}

class Config {
    constructor() {}

    set() {
        this.img_scale = document.getElementById(ID.slider).value;
        this.x_ratio = document.getElementById(ID.xy_slider).value * 1
        this.y_ratio = document.getElementById(ID.xy_slider).value * 2
    }

    reset() {
        this.x_ratio = DEFAULT_VALUE.x_ratio;
        this.y_ratio = DEFAULT_VALUE.y_ratio;
        this.min_val = DEFAULT_VALUE.min_val;
        this.max_val = DEFAULT_VALUE.max_val;
        this.gamma = DEFAULT_VALUE.gamma;
        this.img_scale = DEFAULT_VALUE.img_scale;
        this.blend_ratio = DEFAULT_VALUE.blend_ratio;
    }

    // set at app construct
    callElem() {}
}

class App {
    constructor() {
        this.elem = new Elem(0, 0);
        this.config = new Config();
        this.elem.callConfig = function () {
                return this
            }
            .bind(this.config);
        this.config.callElem = function () {
                return this
            }
            .bind(this.elem);
        this.init();
    }

    init() {
        this.config.reset();
    }

    start() {
        // resize & draw img to canvas1
        app.elem.resizeAndDrawCns();
        app.chgPage(1);
    }

    restart() {
        document.getElementById(ID.sel).hidden = true;
        document.getElementById(ID.div_art).innerHTML = '';
        this.elem.chgImgSize();
        this.elem.chgXYSize();
        this.config.set();
        setTimeout(() => {
            this.start();
        }, 0);
    }

    edgeDetect() {
        let w = this.elem.getCnsWidth(2),
            h = this.elem.getCnsHeight(2),
            imgData1, imgData2;

        console.log(w, h)
        console.log('-------')
        imgData1 = this.elem.getCtx(2).getImageData(0, 0, w, h);
        imgData2 = this.elem.getCtx(2).getImageData(0, 0, w, h);
        this.elem.rendImg(3, this.elem.getCns(2), w, h, true);

        // Gaussian blur
        StackBlur.imageDataRGBA(imgData2, 0, 0, w, h, 10);
        // invert pic2
        invert(imgData2);
        // blend img1 & img2
        blend(imgData1, imgData2);
        // limit brightness & turn to luma
        adjustLevel(imgData1);
        // convert art pic
        this.toArt(imgData1);
        this.elem.rendImgData(3, imgData1);
        this.chgPage(2)
    }

    toArt(imgData) {
        var arr = ["X", "I", "W", "`", "r", "C", "~", "V", "U", "t", "$", "@", "f", "^", "2", "3", "x", "&", "Q", "z", "Z", "-", "n", "*", "E", "N", "H", ")", "A", "R", "g", "d", "O", "%", "8", "F", "B", "!", "M", "s", "a", "m", "l", "h", "k", "0", "4", "L", "P", "j", "(", "1", "K", "5", "u", "_", "7", "#", "G", "+", "e", "p", "v", "T", "Y", "J", "c", "S", "b", "o", "w", "q", "y", "D", ".", "9", "6", "i", `'`, `"`]
        let div_art = document.getElementById(ID.div_art),
            w = this.elem.getCnsWidth(3),
            h = this.elem.getCnsHeight(3),
            x_ratio = ~~this.config.x_ratio,
            y_ratio = ~~this.config.y_ratio,
            avg = 0;

        div_art.innerHTML = '';
        if (h % 2 != 0) h -= 1;
        for (let i = 0; i < imgData.data.length; i += 4)
            avg += imgData.data[i];
        avg /= (imgData.data.length / 4);
        for (let j = 0; j < h; j += y_ratio) {
            let div = document.createElement('div'),
                str = '';
            for (let i = 0; i < w; i += x_ratio) {
                if (imgData.data[(i + j * w) * 4 + 3] == 0)
                    continue;
                let d = get_pixel(i, j);
                if (d >= avg) {
                    str += '&nbsp;'
                    continue;
                } else {
                    //random
                    str += arr[Math.floor(Math.random() * arr.length)];
                    continue;
                }
            }
            div.innerHTML = str;
            div_art.appendChild(div);
        }

        function get_pixel(x, y) {
            let data = 0;
            for (let i = x; i < x + x_ratio; ++i)
                for (let j = y; j < y + y_ratio; ++j)
                    data += imgData.data[(i + j * w) * 4];
            return data / (x_ratio * y_ratio);
        }
    }

    chgPage(i) {
        let top;
        switch (i) {
            case 0:
                top = 0;
                break
            case 1:
                top = window.scrollY +
                    document.getElementById(ID.page2).getBoundingClientRect().top;
                break
            case 2:
                top = window.scrollY +
                    app.elem.cns[1].getBoundingClientRect().top +
                    app.elem.cns[1].getBoundingClientRect().height;
                break
        }
        // check does browser support scrollOption
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: top,
                left: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, top);
        }
    }
}

window.onload = () => {
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        console.log(is_first)
        if (is_first) {
            app = new App();
            document.getElementById(ID.slider).oninput = () => {
                app.restart()
            };
            document.getElementById(ID.xy_slider).oninput = () => {
                app.restart()
            };
            setSelArea();
        }
        document.getElementById(ID.sel).hidden = true;
        div_art = document.getElementById(ID.div_art).innerHTML = '';
        app.start();
    }
    img.onerror = function () {
        document.getElementById(ID.url).style.color = 'red';
    }
}