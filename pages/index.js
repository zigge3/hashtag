import { useEffect, useRef } from "react";
import Game from "./Game";

export default function Home() {
  const canvasRef = useRef();
  useEffect(() => {
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;
    const game = new Game({ canvas: canvasRef.current });
    return () => game.close;
  });
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
