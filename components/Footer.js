import { useState } from "react";
import DynamicSvg from "./DynamicSvg";
import { tinaField } from "tinacms/dist/react";
import insta from "../public/images/insta.svg";
import rightArrow from "../public/images/right_arrow.svg";

export default function Footer({
  data,
  fontColor,
  buttonColor,
  buttonHoverColor,
  backgroundColor,
  faqsOpen,
  setFaqsOpen,
}) {
  const [email, setEmail] = useState("");
  const [showSignup, setShowSignup] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleClick = () => {
    if (emailRegex.test(email)) {
      setInvalidEmail(false);
      setShowSignup(false);
    } else {
      setInvalidEmail(true);
    }
  };

  return (
    <div className="mt-16 lg:mt-24 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto flex flex-col justify-start gap-6">
      {data.data.footer.signup.toggle && (
        <div className="relative w-full flex flex-col items-center mb-2 sm:mb-6">
          <div
            className={`absolute top-0 left-0 right-0 flex justify-center items-center transition-opacity duration-300 h-full ${
              showSignup ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-center my-auto">
              <div> {data.data.footer.signup.thankYouMessage} </div>
            </div>
          </div>
          <div
            className={`w-full flex flex-row justify-center transition-opacity duration-300 ${
              showSignup ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="relative rounded-xl sm:w-80 p-3 w-full max-w-80"
              style={{
                backgroundColor,
                boxShadow: "0px 3px 19.5px 3px rgba(0, 0, 0, 0.07",
              }}
            >
              <div className="flex justify-between items-center">
                <div
                  className="text-base font-medium"
                  data-tina-field={tinaField(data.data.footer.signup, "text")}
                >
                  {data.data.footer.signup.text}
                </div>
              </div>
              <div className="mt-3 flex flex-row justify-between gap-2">
                <div className="flex flex-col w-full">
                  <input
                    className="w-full p-2 rounded-full text-sm px-4"
                    style={{
                      backgroundColor: buttonColor,
                      outline: "none",
                    }}
                    type="email"
                    placeholder={data.data.footer.signup.placeholder}
                    // data-tina-field={tinaField(
                    //   data.data.footer.signup,
                    //   "placeholder"
                    // )}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div
                    className={`text-xs text-red-500 transition-all duration-300 overflow-hidden ${
                      invalidEmail ? "h-auto mt-2" : "h-0 pt-0"
                    }`}
                  >
                    Please enter a valid email
                  </div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer shrink-0"
                  style={{ backgroundColor: buttonColor }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = buttonHoverColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = buttonColor)
                  }
                  onClick={handleClick}
                >
                  <DynamicSvg
                    src={rightArrow.src}
                    color={fontColor}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.data.footer.insta.toggle ||
      data.data.footer.contact.toggle ||
      data.data.footer.faqs.toggle ? (
        <div className="flex flex-row justify-center gap-4">
          {data.data.footer.insta.toggle && (
            <a
              className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer"
              href={data.data.footer.insta.link}
              target="_blank"
              data-tina-field={tinaField(data.data.footer, "insta")}
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
            >
              <DynamicSvg
                src={insta.src}
                color={fontColor}
                className="mx-auto my-auto"
              />
            </a>
          )}
          {data.data.footer.contact.toggle && (
            <a
              className="h-9 px-4 flex flex-col justify-center rounded-full cursor-pointer"
              data-tina-field={tinaField(data.data.footer, "contact")}
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
              href={`mailto:${data.data.footer.contact.email}`}
            >
              <div className="text-xs xl:text-sm font-medium">
                {data.data.footer.contact.text}
              </div>
            </a>
          )}
          {data.data.footer.faqs.toggle && (
            <div
              className="h-9 px-4 flex flex-col justify-center rounded-full cursor-pointer"
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
              onClick={() => setFaqsOpen(!faqsOpen)}
            >
              <div className="text-xs xl:text-sm font-medium">
                {data.data.footer.faqs.text}
              </div>
            </div>
          )}
        </div>
      ) : null}
      {data.data.footer.bottomText.toggle && (
        <div
          className="mx-auto text-xs xl:text-sm text-center"
          data-tina-field={tinaField(data.data.footer, "bottomText")}
        >
          {data.data.footer.bottomText.text}
        </div>
      )}
    </div>
  );
}
