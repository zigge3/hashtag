import { useEffect, useRef, useState } from "react";
import EditorCharacter from "../public/EditorCharacter";
import Game from "../public/Game";
import standard from "../public/worlds/standard";
import styles from "../styles/Editor.module.css";
let gameInit = false;
export default function Editor(props) {
  console.log(props);
  const canvasRef = useRef();
  const imgRef = useRef("");
  const [object, setObject] = useState(undefined);
  useEffect(() => {
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;
    if (!gameInit) {
      gameInit = true;
      const game = new Game({
        canvas: canvasRef.current,
        Character: EditorCharacter,
        characterOptions: { imgRef, setObject, canvasRef },
        worldObjects: standard,
      });
    }
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
              key={image}
              onClick={() => onPick(image)}
              className={styles.imgPreview}
              src={`../images/${image}`}
            />
          );
        })}
      </div>
      {object && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={styles.object}
        >
          {Object.keys(object).map((key) => {
            const value = object[key];
            console.log(styles);
            if (Array.isArray(value)) {
              return (
                <div className={styles.objectItem}>
                  <span>{key}: </span>

                  {value.map((val, i) => {
                    return (
                      <span>
                        <input
                          onChange={(e) => {
                            object[key][i] = e.target.value;
                          }}
                          defaultValue={val}
                        />
                      </span>
                    );
                  })}
                </div>
              );
            } else {
              return (
                <div className={styles.objectItem}>
                  <span>{key}: </span>
                  <input
                    onChange={(e) => {
                      switch (type) {
                      }
                      object[key] = e.target.value;
                      console.log(object);
                    }}
                    defaultValue={JSON.stringify(value)}
                  />
                </div>
              );
            }
          })}
        </div>
      )}
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
