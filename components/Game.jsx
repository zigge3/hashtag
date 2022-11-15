import { useEffect, useRef, useState } from "react";
import Game from "../public/Game";

import io from "socket.io-client";

export default function GameComponent() {
  const canvasRef = useRef();
  const [init, setInit] = useState(false);

  useEffect(() => {
    const id = setTimeout(socketInitializer, 100);

    return () => {
      console.log("This will be logged on unmount");
      clearTimeout(id);
    };
  }, []);

  const socketInitializer = async () => {
    setInit(true);
    await fetch("/api/socket");
    const socket = io();
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;

    const game = new Game({ canvas: canvasRef.current, socket });
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
