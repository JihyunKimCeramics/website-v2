import React, { useEffect, useState, useRef } from "react";
import DynamicSvg from "./DynamicSvg";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import close from "../public/images/close.svg";
import downArrow from "../public/images/down.svg";
import upArrow from "../public/images/up.svg";
import { tinaField } from "tinacms/dist/react";

export default function Faqs({
  data,
  faqsOpen,
  setFaqsOpen,
  backgroundColor,
  fontColor,
  buttonColor,
  buttonHoverColor,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);
  const popupRef = useRef(null);

  const toggleOpen = (index) => {
    setOpenIndex((cur) => (cur === index ? null : index));
  };

  useEffect(() => {
    contentRefs.current.forEach((content, i) => {
      if (!content) return;
      if (i === openIndex) {
        content.style.height = content.scrollHeight + "px";
      } else {
        content.style.height = "0px";
      }
    });
  }, [openIndex]);

  useEffect(() => {
    if (faqsOpen && popupRef.current) {
      popupRef.current.scrollTop = 0;
    }
  }, [faqsOpen]);

  return (
    <>
      {data.home.footer.faqs.toggle &&
        data.home.footer.faqs.faqs.length > 0 && (
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
            <div className="pt-10 xl:pt-14 flex flex-row justify-end mx-12 sm:mx-20 md:mx-auto md:w-200 lg:w-300 xl:w-400">
              <div
                className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer"
                onClick={() => {
                  setFaqsOpen(false);
                  setTimeout(() => setOpenIndex(null), 300);
                }}
              >
                <DynamicSvg src={close.src} color={fontColor} />
              </div>
            </div>
            <div className="flex flex-row justify-center mx-12 -mt-2 sm:mx-20">
              <div className="flex flex-col justify-start gap-6 pb-10 w-full max-w-150 xl:max-w-200">
                <h2
                  className="text-center text-2xl mb-2"
                  data-tina-field={tinaField(data.home.footer.faqs, "title")}
                >
                  {data.home.footer.faqs.title}
                </h2>
                {data.home.footer.faqs.faqs.map((faq, index) => {
                  if (!faq.question || !faq.answer) return null;
                  return (
                    <div
                      key={index}
                      className="rounded-xl cursor-pointer"
                      style={{ backgroundColor: buttonColor }}
                      onClick={() => toggleOpen(index)}
                    >
                      <button
                        className={`w-full text-left flex justify-between items-start p-4 transition-all duration-300 ${
                          openIndex === index ? "pb-2.5" : "pb-4"
                        }`}
                        style={{ color: fontColor }}
                      >
                        <span
                          className="text-base sm:text-lg"
                          data-tina-field={tinaField(faq, "question")}
                        >
                          {faq.question}
                        </span>
                        <div className="relative w-5 h-5 ml-2 flex-shrink-0">
                          <DynamicSvg
                            src={downArrow.src}
                            color={fontColor}
                            className={`absolute inset-0 transition-opacity duration-300 ${
                              openIndex === index ? "opacity-0" : "opacity-100"
                            } mt-1.5`}
                          />
                          <DynamicSvg
                            src={upArrow.src}
                            color={fontColor}
                            className={`absolute inset-0 w-4 h-4 transition-opacity duration-300 ${
                              openIndex === index ? "opacity-100" : "opacity-0"
                            } mt-1.5`}
                          />
                        </div>
                      </button>
                      <div
                        ref={(el) => (contentRefs.current[index] = el)}
                        className="overflow-hidden transition-[height] duration-300 ease-out"
                        style={{ height: 0 }}
                      >
                        <div
                          className="px-4 pb-4 text-sm sm:text-base font-light prose max-w-none"
                          style={{ color: fontColor }}
                        >
                          <div
                            className="space-y-4"
                            data-tina-field={tinaField(faq, "answer")}
                          >
                            <TinaMarkdown content={faq.answer} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
    </>
  );
}
