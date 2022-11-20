import { useEffect, useRef, useState } from "react";
import Game from "../public/Game";
import Timmy from "../public/classes/Timmy";
import Kevin from "../public/classes/Kevin";
import Moller from "../public/classes/Moller";
import Maja from "../public/classes/Maja";
import Johan from "../public/classes/Johan";

const classMap = {
  timmy: Timmy,
  kevin: Kevin,
  maja: Maja,
  moller: Moller,
  johan: Johan,
};

import io from "socket.io-client";
import { useRouter } from "next/router";
export default function GameComponent({ character }) {
  const canvasRef = useRef();
  const [init, setInit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const type = urlSearchParams.get("type");
    const timeScale = urlSearchParams.get("timeScale");
    const id = setTimeout(() => socketInitializer({ type, timeScale }), 100);
    return () => {
      clearTimeout(id);
    };
  }, []);

  const socketInitializer = async ({ type, timeScale }) => {
    setInit(true);
    await fetch("/api/socket");
    const socket = io();
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;

    const game = new Game({
      canvas: canvasRef.current,
      socket,
      timeScale,
      Character: classMap[type] || Kevin,
    });
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
