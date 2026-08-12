import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  isVisible: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const barCount = 48;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      phase += isPlaying ? 0.08 : 0.01;

      for (let i = 0; i < barCount; i++) {
        // Compute wave height based on sine + cosine combination
        const factor = isPlaying
          ? Math.abs(
              Math.sin(phase + i * 0.3) * 0.6 +
                Math.cos(phase * 0.7 + i * 0.2) * 0.4
            )
          : 0.1;

        const barHeight = Math.max(4, factor * height * 0.85);
        const x = i * (barWidth + gap) + gap / 2;
        const y = height - barHeight;

        // Indian Tricolor Gradient per bar or top-to-bottom
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, '#FF671F'); // Saffron
        gradient.addColorStop(0.5, '#FFFFFF'); // White
        gradient.addColorStop(1, '#138808'); // Green

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto h-16 px-4 my-2 z-10 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={64}
        className="w-full h-full opacity-85 transition-opacity duration-300"
      />
    </div>
  );
};
