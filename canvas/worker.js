self.onmessage = function (event) {
    var pixels = event.data;

    // 将像素点的颜色改为蓝色
    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] = 0;       // 红色通道设为0
        pixels[i + 1] = 0;   // 绿色通道设为0
        pixels[i + 2] = 255; // 蓝色通道设为255
    }

    // 将处理后的像素数据发送回主线程
    self.postMessage(pixels);
};