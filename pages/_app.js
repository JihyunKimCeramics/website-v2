import "../styles.css";
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { tinaField, useTina } from "tinacms/dist/react";
import DynamicSvg from "../components/DynamicSvg";

import menu from "../public/images/menu.svg";
import shop from "../public/images/shop.svg";
import insta from "../public/images/insta.svg";
import close from "../public/images/close.svg";
import rightArrow from "../public/images/right_arrow.svg";

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
        transition-opacity
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
  showSignUpBox,
  backgroundColor,
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
            onClick={() => showSignUpBox()}
          >
            <div className="text-xs xl:text-sm font-medium">
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
  const [opacity, setOpacity] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tina data
  const { data } = useTina({
    query: pageProps.query,
    variables: pageProps.variables,
    data: pageProps.data,
  });

  if (!data?.home) {
    return <div>Loading...</div>;
  }

  // Theme
  const fontColor = data.home.theme.textColour;
  const backgroundColor = data.home.theme.backgroundColour;
  const buttonColor = data.home.theme.buttonColour;
  const buttonHoverColor = data.home.theme.buttonHoverColour;

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

  // Fade in/out on route changes
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

  // Lock scroll on mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <div
      style={{
        opacity,
        color: fontColor,
        backgroundColor,
      }}
    >
      <Head>
        <title>Jihyun Kim Ceramic</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      {/* Mobile Menu */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
      />

      <div className="pt-10 xl:pt-14 pb-16 lg:pb-24">
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
        />
      </div>
    </div>
  );
}
