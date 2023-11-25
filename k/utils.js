export function findClosestId(arr, value) {
    let minDiff = Math.abs(arr[0] - value);
    let closestId = 0;

    for (let i = 1; i < arr.length; i++) {
        let diff = Math.abs(arr[i] - value);
        if (diff < minDiff) {
            minDiff = diff;
            closestId = i;
        }
    }

    return { id: closestId, x: arr[closestId] };
}

export function drawLine(ctx, x, y, X, Y, color = '#fff') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(X, Y);
    ctx.stroke();
    ctx.closePath();
}

export function removeOddIndexItems(arr) {
    return arr.filter((_, index) => index % 2 === 0);
}

export function drawText(ctx, val, x, y, { color, fontSize }) {
    ctx.save()
    ctx.scale(1, -1)

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color
    ctx.fillText(val, x, -y)
    ctx.restore()
}

export function drawPolyline(ctx, points, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
}

export function drawCurve(ctx, points, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // 绘制起始点
    ctx.moveTo(points[0][0], points[0][1]);

    // 将每个折线点转换为曲线点
    for (let i = 1; i < points.length - 1; i++) {
        const x = (points[i][0] + points[i + 1][0]) / 2;
        const y = (points[i][1] + points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(points[i][0], points[i][1], x, y);
    }

    // 绘制最后一个点
    ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1]);

    ctx.stroke();
}