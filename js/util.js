function invert(imgData) {
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i]
        imgData.data[i + 1] = 255 - imgData.data[i + 1]
        imgData.data[i + 2] = 255 - imgData.data[i + 2]
    }
}

function blend(imgData1, imgData2) {
    var ratio = app.config.blend_ratio
    for (let i = 0; i < imgData1.data.length; i += 4) {
        imgData1.data[i] = imgData1.data[i] * (1 - ratio) + imgData2.data[i] * ratio
        imgData1.data[i + 1] = imgData1.data[i + 1] * (1 - ratio) + imgData2.data[i + 1] * ratio
        imgData1.data[i + 2] = imgData1.data[i + 2] * (1 - ratio) + imgData2.data[i + 2] * ratio
    }
}

function adjustLevel(imgData) {
    var min_val = app.config.min_val / 255,
        max_val = app.config.max_val / 255,
        gammaCorrection = 1 / app.config.gamma;

    for (let i = 0; i < imgData.data.length; i += 4) {
        let px = {
            r: imgData.data[i],
            g: imgData.data[i + 1],
            b: imgData.data[i + 2]
        },
            luma = 0;

        px = RGBtoHSV(px.r, px.g, px.b)
        if (px.v <= min_val) px.v = 0
        else if (px.v >= max_val) px.v = 1
        else px.v = Math.pow((px.v - min_val) / (max_val - min_val), gammaCorrection);
        px = HSVtoRGB(px.h, px.s, px.v)

        luma = .2126 * px.r + .7152 * px.g + .0722 * px.b
        imgData.data[i] = luma
        imgData.data[i + 1] = luma
        imgData.data[i + 2] = luma
    }
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}