import React from "react";
import ReactPlayer from "react-player";
import "./Infor.css";

export default function YoutubePlayer({ url }) {
  const isValid = ReactPlayer.canPlay(url);
  console.log(url)
  return (
    <div className="overlay" style={{ zIndex: 9999 }}>
      <div className="content" style={{ width: "840px", height: "660px" }}>
        {isValid ? (
          <ReactPlayer
            url={"https://www.youtube.com/watch?v=iu-LBY7NXD4"}
            width="100%"
            height="100%"
            controls={true}
            playing={true} // autoplay nếu browser cho phép
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              borderRadius: "8px",
            }}
          >
            ⚠️ Không thể phát video với URL này
          </div>
        )}
      </div>
    </div>
  );
}
