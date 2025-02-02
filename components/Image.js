import React from "react";
import { tinaField } from "tinacms/dist/react";

const Image = ({ height, image, item, tinaName, widthFraction = 1 }) => {
  const aspectRatio = height || 1;
  const adjustedHeight = aspectRatio / widthFraction;

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{ paddingBottom: `${adjustedHeight * 20}%` }}
      data-tina-field={tinaField(item, tinaName)}
    >
      <img
        src={image}
        alt=""
        className="object-cover absolute top-0 left-0 w-full h-full"
        draggable="false"
      />
    </div>
  );
};

export default Image;
