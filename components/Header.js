import { useEffect, useState } from "react";
import Menu from "../public/images/menu.svg";
import Shop from "../public/images/shop.svg";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import RightArrow from "../public/images/right_arrow.svg";

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
  enableBannerLink,
  bannerLink,
  title,
  projectsPageTitle,
  exhibitionsPageTitle,
  shopPageTitle,
  shopPageLink,
  aboutPageTitle,
  titleFont,
  titleFontWeight,
  cartCount,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {showBanner && (
        <a
          href={enableBannerLink ? bannerLink : "#"}
          className={`group w-full flex flex-row justify-center items-center py-3 ${
            enableBannerLink
              ? "cursor-pointer hover:opacity-85 transition-opacity duration-150"
              : "cursor-default"
          }`}
          style={{ backgroundColor: bannerColor }}
        >
          <div className="text-sm lg:text-sm xl:text-base text-center mx-12 sm:mx-20 md:mx-auto md:w-200 lg:w-300 xl:w-400 flex flex-row justify-center gap-2">
            <TinaMarkdown content={bannerText} />
            <RightArrow className="h-[14px] w-[14px] my-auto transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </div>
        </a>
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
          className="w-9 h-9 rounded-full flex flex-row justify-center cursor-pointer md:hidden transition-all duration-300"
          style={{ backgroundColor: buttonColor }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = buttonHoverColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = buttonColor)
          }
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-[15px] w-[15px] block shrink-0 cursor-pointer my-auto" />
        </div>
        <div className="hidden md:flex gap-6 lg:gap-7 xl:gap-8 text-sm lg:text-md xl:text-base">
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
            <a className="relative cursor-pointer" href="/basket">
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
                <Shop className="h-[16.5px] w-[16.5px] my-auto" />
              </div>
              {mounted && cartCount > 0 && (
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex flex-row justify-center items-center"
                  style={{ backgroundColor: fontColor, color: buttonColor }}
                >
                  <div className="text-xs font-semibold">{cartCount}</div>
                </div>
              )}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
