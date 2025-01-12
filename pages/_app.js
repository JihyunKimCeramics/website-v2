import "../styles.css";
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import DynamicSvg from "../components/DynamicSvg";

import menu from "../public/images/menu.svg";
import shop from "../public/images/shop.svg";
import insta from "../public/images/insta.svg";
import close from "../public/images/close.svg";
import rightArrow from "../public/images/right_arrow.svg";
import upArrow from "../public/images/up.svg";
import downArrow from "../public/images/down.svg";

function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  backgroundColor,
  fontColor,
  buttonColor,
  buttonHoverColor,
}) {
  return (
    <div
      id="Menu"
      className={`
        md:hidden
        w-full
        h-screen
        absolute
        top-0
        left-0
        z-20
        transition-all
        duration-300
        ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      style={{ backgroundColor }}
    >
      <div className="pt-10 xl:pt-14">
        <div className="md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto flex flex-row justify-end">
          <div
            className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <DynamicSvg
              src={close.src}
              color={fontColor}
              className="mx-auto my-auto"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center -mt-2">
        <div className="flex flex-col gap-8 text-center text-lg">
          <div
            className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer mx-auto"
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = buttonHoverColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = buttonColor)
            }
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <DynamicSvg
              src={shop.src}
              color={fontColor}
              className="mx-auto my-auto"
            />
          </div>
          <a
            className="my-auto hover:opacity-70"
            href="#"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Projects
          </a>
          <a
            className="my-auto hover:opacity-70"
            href="#"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            About
          </a>
          <a
            className="my-auto hover:opacity-70"
            href="#"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Shop
          </a>
          <a
            className="my-auto hover:opacity-70"
            href="#"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Exhibitions
          </a>
        </div>
      </div>
    </div>
  );
}

function Faqs({
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
            className={`
              fixed 
              top-0 left-0
              w-full
              h-full
              z-20
              transition-opacity
              duration-300
              overflow-y-auto
              ${faqsOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            style={{
              backgroundColor,
              overflowY: faqsOpen ? "auto" : "hidden",
            }}
          >
            {/* Close Button Row */}
            <div className="pt-10 xl:pt-14 flex flex-row justify-end mx-12 sm:mx-20">
              <div
                className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer"
                onClick={() => setFaqsOpen(!faqsOpen)}
              >
                <DynamicSvg src={close.src} color={fontColor} />
              </div>
            </div>

            <div className="flex flex-row justify-center mx-12 -mt-2 sm:mx-20">
              <div className="flex flex-col justify-start gap-6 pb-10 w-full max-w-150 xl:max-w-200">
                <h2 className="text-center text-2xl mb-2">
                  {data.home.footer.faqs.title}
                </h2>
                {data.home.footer.faqs.faqs.map((faq, index) => {
                  // Only render if both question & answer exist
                  if (!faq.question || !faq.answer) return null;

                  return (
                    <div
                      key={index}
                      className="rounded-xl"
                      style={{ backgroundColor: buttonColor }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          buttonHoverColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = buttonColor)
                      }
                    >
                      <button
                        onClick={() => toggleOpen(index)}
                        className={`w-full text-left flex justify-between items-start p-4 transition-all duration-300 ${
                          openIndex === index ? "pb-2.5" : "pb-4"
                        }`}
                        style={{ color: fontColor }}
                      >
                        <span className="text-base sm:text-lg">
                          {faq.question}
                        </span>
                        <div className="relative w-5 h-5 ml-2 flex-shrink-0">
                          <DynamicSvg
                            src={upArrow.src}
                            color={fontColor}
                            className={`absolute inset-0 transition-opacity duration-300 ${
                              openIndex === index ? "opacity-0" : "opacity-100"
                            } mt-1.5`}
                          />
                          <DynamicSvg
                            src={downArrow.src}
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
                          className="px-4 pb-4 text-sm sm:text-base font-light"
                          style={{ color: fontColor }}
                        >
                          <TinaMarkdown content={faq.answer} />
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

function SiteHeader({
  data,
  mobileMenuOpen,
  setMobileMenuOpen,
  fontColor,
  buttonColor,
  buttonHoverColor,
}) {
  return (
    <div className="md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto flex flex-row justify-between">
      <h1
        className="font-light text-xl md:text-2xl my-auto"
        data-tina-field={tinaField(data.home.header, "title")}
      >
        {data.home.header.title}
      </h1>
      <div
        className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer md:hidden"
        style={{ backgroundColor: buttonColor }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = buttonHoverColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = buttonColor)
        }
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <DynamicSvg
          src={menu.src}
          color={fontColor}
          className="mx-auto my-auto"
        />
      </div>
      <div className="hidden md:flex gap-6 lg:gap-7 xl:gap-8 text-sm lg:text-smmd xl:text-base">
        <a className="my-auto hover:opacity-70" href="#">
          Projects
        </a>
        <a className="my-auto hover:opacity-70" href="#">
          About
        </a>
        <a className="my-auto hover:opacity-70" href="#">
          Shop
        </a>
        <a className="my-auto hover:opacity-70" href="#">
          Exhibitions
        </a>
        <div
          className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer"
          style={{ backgroundColor: buttonColor }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = buttonHoverColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = buttonColor)
          }
        >
          <DynamicSvg
            src={shop.src}
            color={fontColor}
            className="mx-auto my-auto"
          />
        </div>
      </div>
    </div>
  );
}

function SiteFooter({
  data,
  fontColor,
  buttonColor,
  buttonHoverColor,
  backgroundColor,
  faqsOpen,
  setFaqsOpen,
}) {
  return (
    <div className="mt-16 lg:mt-24 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto flex flex-col justify-start gap-6">
      <div className="w-full flex flex-row justify-center pb-2 sm:pb-6">
        <div
          className="relative rounded-xl sm:w-80 p-3 w-full max-w-80"
          style={{
            backgroundColor,
            boxShadow: "0px 3px 19.5px 3px rgba(0, 0, 0, 0.07",
          }}
        >
          <div className="flex justify-between items-center">
            <div className="text-base font-medium">Let's stay in touch!</div>
          </div>

          <div className="mt-3 flex flex-row justify-between gap-2">
            <input
              className="w-full p-2 rounded-full text-sm px-4"
              style={{
                backgroundColor: buttonColor,
                outline: "none",
              }}
              type="email"
              placeholder="Enter your email"
            />
            <div
              className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer shrink-0"
              target="_blank"
              data-tina-field={tinaField(data.home.footer, "insta")}
              style={{ backgroundColor: buttonColor }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = buttonHoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = buttonColor)
              }
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
      <div className="flex flex-row justify-center gap-4">
        {data.home.footer.insta.toggle && (
          <a
            className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer"
            href={data.home.footer.insta.link}
            target="_blank"
            data-tina-field={tinaField(data.home.footer, "insta")}
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
        {data.home.footer.contact.toggle && (
          <a
            className="h-9 px-4 flex flex-col justify-center rounded-full cursor-pointer"
            data-tina-field={tinaField(data.home.footer, "contact")}
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = buttonHoverColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = buttonColor)
            }
            href={`mailto:${data.home.footer.contact.email}`}
          >
            <div className="text-xs xl:text-sm font-medium">
              {data.home.footer.contact.text}
            </div>
          </a>
        )}
        {data.home.footer.faqs.toggle && (
          <div
            className="h-9 px-4 flex flex-col justify-center rounded-full cursor-pointer"
            data-tina-field={tinaField(data.home.footer, "faqs")}
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = buttonHoverColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = buttonColor)
            }
          >
            <div
              className="text-xs xl:text-sm font-medium"
              onClick={() => setFaqsOpen(!faqsOpen)}
            >
              {data.home.footer.faqs.text}
            </div>
          </div>
        )}
      </div>
      {data.home.footer.bottomText.toggle && (
        <div
          className="mx-auto text-xs xl:text-sm text-center"
          data-tina-field={tinaField(data.home.footer, "bottomText")}
        >
          {data.home.footer.bottomText.text}
        </div>
      )}
    </div>
  );
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);

  // If ANY popup is open, we lock scroll.
  const isPopupOpen = mobileMenuOpen || faqsOpen;

  // For preserving scroll position
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Tina data
  const { data } = useTina({
    query: pageProps.query,
    variables: pageProps.variables,
    data: pageProps.data,
  });

  // Basic check
  if (!data?.home) {
    return <div>Loading...</div>;
  }

  // Theme
  const fontColor = data.home.theme.textColour;
  const backgroundColor = data.home.theme.backgroundColour;
  const buttonColor = data.home.theme.buttonColour;
  const buttonHoverColor = data.home.theme.buttonHoverColour;

  // 1) Fade in/out on route changes (same as before)
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const handleRouteChangeStart = () => setOpacity(0);
    const handleRouteChangeComplete = () => setOpacity(1);

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  // 2) Lock body scroll & preserve position if ANY popup is open
  useEffect(() => {
    if (isPopupOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      setPrevScrollPos(scrollY);

      // Apply fixed position BEFORE the modal appears
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;

      return () => {
        // Cleanup function to handle unexpected unmounts
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    } else {
      // Restore scroll position immediately
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, prevScrollPos);
    }
  }, [isPopupOpen, prevScrollPos]);

  // 3) Close mobile menu if resized beyond your breakpoint
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // call on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set background color
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );

    return () => {
      document.documentElement.style.removeProperty("--background-color");
    };
  }, [backgroundColor]);

  return (
    <div
      style={{
        opacity, // route-change fade
        color: fontColor,
        backgroundColor,
      }}
      className="relative" // so popups can stack over it
    >
      <Head>
        <title>Jihyun Kim Ceramic</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      {/* MAIN CONTENT (always rendered, never hidden) */}
      <div className="pt-10 xl:pt-14 pb-16 lg:pb-24 transition-all duration-300">
        <SiteHeader
          data={data}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fontColor={fontColor}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
        />

        <Component {...pageProps} />

        <SiteFooter
          data={data}
          fontColor={fontColor}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          backgroundColor={backgroundColor}
          faqsOpen={faqsOpen}
          setFaqsOpen={setFaqsOpen}
        />
      </div>

      {/* POPUPS (stacked on top, typically using fixed + z-index) */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
      />

      <Faqs
        data={data}
        faqsOpen={faqsOpen}
        setFaqsOpen={setFaqsOpen}
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
      />
    </div>
  );
}
