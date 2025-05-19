import { useEffect, useState } from "react";
import DynamicSvg from "./DynamicSvg";
import close from "../public/images/close.svg";
import shop from "../public/images/shop.svg";

export default function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  backgroundColor,
  fontColor,
  buttonColor,
  buttonHoverColor,
  showProjectsPage,
  projectsPageTitle,
  showExhibitionsPage,
  exhibitionsPageTitle,
  showShopPage,
  shopPageTitle,
  shopPageLink,
  showAboutPage,
  aboutPageTitle,
  cartCount,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      id="Menu"
      className={`md:hidden w-full h-full fixed top-0 left-0 z-20 transition-all duration-300 ${
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
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
          {showShopPage && (
            <a href="/cart" className="relative cursor-pointer">
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
              {mounted && cartCount > 0 && (
                <div
                  className="absolute -top-2 right-4.5 w-5 h-5 rounded-full flex flex-row justify-center items-center"
                  style={{ backgroundColor: fontColor, color: buttonColor }}
                >
                  <div className="text-xs font-semibold">{cartCount}</div>
                </div>
              )}
            </a>
          )}
          {/* {showShopPage && (
            <a className="relative cursor-pointer" href="/cart">
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
              {mounted && cartCount > 0 && (
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex flex-row justify-center items-center"
                  style={{ backgroundColor: fontColor, color: buttonColor }}
                >
                  <div className="text-xs font-semibold">{cartCount}</div>
                </div>
              )}
            </a>
          )} */}
          {showProjectsPage && (
            <a
              className="my-auto hover:opacity-70"
              href="/projects"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {projectsPageTitle}
            </a>
          )}
          {showAboutPage && (
            <a
              className="my-auto hover:opacity-70"
              href="/about"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {aboutPageTitle}
            </a>
          )}
          {showShopPage && (
            <a
              className="my-auto hover:opacity-70"
              href="/shop"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {shopPageTitle}
            </a>
          )}
          {showExhibitionsPage && (
            <a
              className="my-auto hover:opacity-70"
              href="/exhibitions"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {exhibitionsPageTitle}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
