import React from "react";
import DynamicSvg from "./DynamicSvg";
import { tinaField } from "tinacms/dist/react";
import menu from "../public/images/menu.svg";
import shop from "../public/images/shop.svg";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  fontColor,
  buttonColor,
  buttonHoverColor,
  bannerColor,
  showProjectsPage,
  showExhibitionsPage,
  showShopPage,
  showAboutPage,
  header,
  showBanner,
  bannerText,
  title,
  projectsPageTitle,
  exhibitionsPageTitle,
  shopPageTitle,
  shopPageLink,
  aboutPageTitle,
  titleFont,
  titleFontWeight,
}) {
  return (
    <>
      {showBanner && (
        <div
          className="w-full flex flex-row justify-center items-center py-3"
          style={{ backgroundColor: bannerColor }}
          data-tina-field={tinaField(header, "bannerText")}
        >
          <div className="text-sm lg:text-sm xl:text-base text-center mx-12 sm:mx-20 md:mx-auto md:w-200 lg:w-300 xl:w-400">
            <TinaMarkdown content={bannerText} />
          </div>
        </div>
      )}
      <div className="pt-10 xl:pt-14 md:w-200 lg:w-300 xl:w-400 mx-12 sm:mx-20 md:mx-auto flex flex-row justify-between">
        <a
          className="text-xl md:text-2xl my-auto"
          style={{ fontFamily: titleFont, fontWeight: titleFontWeight }}
          href="/"
        >
          {title}
        </a>
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
          {showProjectsPage && (
            <a className="my-auto hover:opacity-70" href="/projects">
              {projectsPageTitle}
            </a>
          )}
          {showAboutPage && (
            <a className="my-auto hover:opacity-70" href="/about">
              {aboutPageTitle}
            </a>
          )}
          {showShopPage && (
            <a className="my-auto hover:opacity-70" href="/shop">
              {shopPageTitle}
            </a>
          )}
          {showExhibitionsPage && (
            <a className="my-auto hover:opacity-70" href="/exhibitions">
              {exhibitionsPageTitle}
            </a>
          )}
          {showShopPage && (
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
          )}
        </div>
      </div>
    </>
  );
}
