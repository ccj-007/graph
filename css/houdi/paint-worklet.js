/* paint-worklet.js */
registerPaint('my-gradient', class {
    paint(ctx, geom) {
        const gradient = ctx.createLinearGradient(0, 0, geom.width, geom.height);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1, 'blue');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, geom.width, geom.height);
    }
});