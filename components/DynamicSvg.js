import React, { useState, useRef, useEffect } from "react";

const DynamicSvg = ({ src, color, className }) => {
  const [svgContent, setSvgContent] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    fetch(src)
      .then((response) => response.text())
      .then((text) => {
        if (isMounted.current) {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(text, "image/svg+xml");
          const svgElement = svgDoc.documentElement;

          // Set the color for both stroke and fill
          svgElement.querySelectorAll("*").forEach((el) => {
            if (el.getAttribute("stroke")) {
              el.setAttribute("stroke", color);
            }
            if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
              el.setAttribute("fill", color);
            }
          });

          setSvgContent(svgElement.outerHTML);
        }
      });

    return () => {
      isMounted.current = false;
    };
  }, [src, color]);

  if (!svgContent) {
    return null;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default DynamicSvg;
