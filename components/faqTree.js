import React, { useState, useRef } from "react";
import { tinaField } from "tinacms/dist/react";
import DynamicSvg from "../components/DynamicSvg";
import { TinaMarkdown } from "tinacms/dist/rich-text";

const FaqTree = ({
  faqs,
  backgroundColour,
  textColour,
  downArrow,
  px,
  pt,
  pbOpen,
  pbClosed,
  titleFont,
  answerFont,
}) => {
  const [faqIndex, setFaqIndex] = useState(-1);
  const [faqOpen, setFaqOpen] = useState(false);

  const handleFAQClick = (index) => {
    const isSame = faqIndex === index;
    setFaqIndex(index);
    setFaqOpen(isSame ? !faqOpen : true);
  };

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, index) => {
        if (!faq.question || !faq.answer) return null;
        const contentRef = useRef(null);

        return (
          <div
            key={index}
            className="rounded-xl cursor-pointer"
            style={{ backgroundColor: backgroundColour }}
            onClick={() => handleFAQClick(index)}
          >
            <button
              className={`w-full text-left flex justify-between items-start ${px} ${pt} transition-all duration-300 ${
                faqIndex === index && faqOpen === true ? pbOpen : pbClosed
              }`}
              style={{ color: textColour }}
            >
              <span
                className={titleFont}
                data-tina-field={tinaField(faq, "question")}
              >
                {faq.question}
              </span>
              <DynamicSvg
                src={downArrow.src}
                color={textColour}
                className={`transition-transform duration-300 my-auto ${
                  faqIndex === index && faqOpen === true
                    ? "rotate-180"
                    : "rotate-0"
                }`}
                style={{
                  transformOrigin: "center",
                  transformBox: "fill-box",
                }}
              />
            </button>
            <div
              ref={contentRef}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                height:
                  faqIndex === index && faqOpen
                    ? `${contentRef.current?.scrollHeight}px`
                    : "0px",
              }}
            >
              <div
                className={`px-5 pb-3 ${answerFont} font-light prose max-w-none`}
                style={{ color: textColour }}
              >
                <div data-tina-field={tinaField(faq, "answer")}>
                  <TinaMarkdown
                    content={faq.answer}
                    components={{
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqTree;
