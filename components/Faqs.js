import React, { useEffect, useState, useRef } from "react";
import DynamicSvg from "./DynamicSvg";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import close from "../public/images/close.svg";
import downArrow from "../public/images/down.svg";
import { tinaField } from "tinacms/dist/react";
import FaqTree from "./faqTree";

export default function Faqs({
  faqsOpen,
  setFaqsOpen,
  backgroundColor,
  fontColor,
  buttonColor,
  faqs,
  faqsTitle,
  faqsTitleTinafield,
  faqsToggle,
}) {
  const popupRef = useRef(null);

  return (
    <>
      {faqsToggle && faqs.length > 0 && (
        <div
          ref={popupRef}
          className={`fixed top-0 left-0 w-full h-full z-20 transition-opacity duration-300 overflow-y-auto ${
            faqsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundColor,
            overflowY: faqsOpen ? "auto" : "hidden",
          }}
        >
          <div className="pt-10 xl:pt-14 flex flex-row justify-end mx-12 sm:mx-20 md:mx-auto md:w-150 xl:w-200">
            <div
              className="w-9 h-9 rounded-full flex flex-row justify-end cursor-pointer"
              onClick={() => {
                setFaqsOpen(false);
              }}
            >
              <DynamicSvg src={close.src} color={fontColor} />
            </div>
          </div>
          <div className="flex flex-row justify-center mx-12 -mt-2 sm:mx-20">
            <div className="flex flex-col justify-start gap-6 pb-10 w-full max-w-150 xl:max-w-200">
              <h2
                className="text-center text-2xl mb-2"
                data-tina-field={tinaField(faqsTitleTinafield, "title")}
              >
                {faqsTitle}
              </h2>
              <FaqTree
                faqs={faqs}
                backgroundColour={buttonColor}
                textColour={fontColor}
                downArrow={downArrow}
                px="px-4"
                pt="pt-4"
                pbOpen="pb-2.5"
                pbClosed="pb-4"
                titleFont="text-base sm:text-lg"
                answerFont="text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
