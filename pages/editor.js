import { useEffect, useRef } from "react";
import EditorCharacter from "../public/EditorCharacter";
import Game from "../public/Game";
import styles from "../styles/Editor.module.css";

export default function Editor(props) {
  console.log(props);
  const canvasRef = useRef();
  const imgRef = useRef("");
  useEffect(() => {
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;

    const game = new Game({
      canvas: canvasRef.current,
      Character: EditorCharacter,
      characterOptions: { imgRef },
    });
  }, []);

  const onPick = (img) => {
    imgRef.current = img;
  };

  return (
    <div>
      <canvas ref={canvasRef} />

      <div className={styles.preview}>
        <button onClick={() => onPick("")}>DEFAULT</button>
        {props.images.map((image) => {
          return (
            <img
              onClick={() => onPick(image)}
              className={styles.imgPreview}
              src={`../images/${image}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  var fs = require("fs");
  var files = fs.readdirSync("public/images/");
  return {
    props: { images: files }, // will be passed to the page component as props
  };
}
