import { useState } from "react";
import { tinaField } from "tinacms/dist/react";
import Insta from "../public/images/insta.svg";
import RightArrow from "../public/images/right_arrow.svg";

export default function Footer({
  fontColor,
  buttonColor,
  buttonHoverColor,
  backgroundColor,
  faqsOpen,
  setFaqsOpen,
  signupToggle,
  thankYouMessage,
  signUp,
  signupText,
  signupPlaceholder,
  instaToggle,
  instaLink,
  contactToggle,
  contactEmail,
  contactText,
  faqsToggle,
  faqsText,
  bottomTextToggle,
  bottomTextText,
  footer,
}) {
  const [email, setEmail] = useState("");
  const [showSignup, setShowSignup] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleClick = async () => {
    if (!emailRegex.test(email)) {
      setInvalidEmail(true);
      setErrorMessage("Please enter a valid email");
      return;
    }

    setInvalidEmail(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSignup(false);
        setEmail("");
      } else {
        setInvalidEmail(true);
        setErrorMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setInvalidEmail(true);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleClick();
    }
  };

  return (
    <div className="mt-16 lg:mt-24 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto flex flex-col justify-start gap-6">
      {signupToggle && (
        <div className="relative w-full flex flex-col items-center mb-2 sm:mb-6">
          <div
            className={`absolute top-0 left-0 right-0 flex justify-center items-center transition-opacity duration-300 h-full ${
              showSignup ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-center my-auto">
              <div> {thankYouMessage} </div>
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
                  data-tina-field={tinaField(signUp, "text")}
                >
                  {signupText}
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
                    placeholder={signupPlaceholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setInvalidEmail(false);
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                  />
                  <div
                    className={`text-xs text-red-500 transition-all duration-300 overflow-hidden ${
                      invalidEmail ? "h-auto mt-2" : "h-0 pt-0"
                    }`}
                  >
                    {errorMessage}
                  </div>
                </div>
                <div
                  className={`w-9 h-9 rounded-full flex justify-center items-center shrink-0 transition-all duration-300 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  style={{ backgroundColor: buttonColor }}
                  onMouseEnter={(e) =>
                    !isSubmitting &&
                    (e.currentTarget.style.backgroundColor = buttonHoverColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = buttonColor)
                  }
                  onClick={!isSubmitting ? handleClick : undefined}
                >
                  <RightArrow className="h-[14px] w-[14px] my-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {instaToggle || contactToggle || faqsToggle ? (
        <div className="flex flex-row justify-center gap-4">
          {instaToggle && (
            <a
              className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer transition-all duration-300"
              href={instaLink}
              target="_blank"
              data-tina-field={tinaField(footer, "insta")}
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
            >
              <Insta className="h-[17px] w-[17px] my-auto" />
            </a>
          )}
          {contactToggle && (
            <a
              className="h-9 px-4 flex flex-col justify-center rounded-full cursor-pointer transition-all duration-300"
              data-tina-field={tinaField(footer, "contact")}
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
              href={`mailto:${contactEmail}`}
            >
              <div className="text-xs xl:text-sm font-medium">
                {contactText}
              </div>
            </a>
          )}
          {faqsToggle && (
            <div
              className="h-9 px-4 flex flex-col justify-center rounded-full cursor-pointer transition-all duration-300"
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
              onClick={() => setFaqsOpen(!faqsOpen)}
            >
              <div className="text-xs xl:text-sm font-medium">{faqsText}</div>
            </div>
          )}
        </div>
      ) : null}
      {bottomTextToggle && (
        <div
          className="mx-auto text-xs xl:text-sm text-center"
          data-tina-field={tinaField(footer, "bottomText")}
        >
          {bottomTextText}
        </div>
      )}
    </div>
  );
}
