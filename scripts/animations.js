class AnimationManager {
    constructor(canvasManager) {
        this.canvas = canvasManager;
    }

    animateButton(x, y, width, height, text, color, duration) {
        return new Promise(resolve => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                this.canvas.clear();
                const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
                
                this.canvas.drawButton(
                    x - (width * scale - width) / 2,
                    y - (height * scale - height) / 2,
                    width * scale,
                    height * scale,
                    text,
                    color
                );

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }
}