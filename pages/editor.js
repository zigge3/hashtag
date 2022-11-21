import { useEffect, useRef } from "react";
import EditorCharacter from "../public/EditorCharacter";
import Game from "../public/Game";

export default function Editor() {
  const canvasRef = useRef();

  useEffect(() => {
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;

    const game = new Game({
      canvas: canvasRef.current,
      Character: EditorCharacter,
    });
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
