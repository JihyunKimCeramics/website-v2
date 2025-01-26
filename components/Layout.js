import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import Faqs from "./Faqs";

export default function Layout({ data, children }) {
  console.log(data);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const fontColor = data.home.theme.textColour;
  const backgroundColor = data.home.theme.backgroundColour;
  const buttonColor = data.home.theme.buttonColour;
  const buttonHoverColor = data.home.theme.buttonHoverColour;
  const bannerColor = data.home.header.bannerColour;
  const isPopupOpen = mobileMenuOpen || faqsOpen;
  const showProjectsPage = data.projects.header.showProjectsPage;
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

  useEffect(() => {
    if (isPopupOpen) {
      const scrollY = window.scrollY;
      setPrevScrollPos(scrollY);
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
      return () => {
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, prevScrollPos);
    }
  }, [isPopupOpen, prevScrollPos]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      style={{ opacity, color: fontColor, backgroundColor }}
      className="relative"
    >
      <div className="pb-16 lg:pb-24 transition-all duration-300">
        <Header
          data={data}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fontColor={fontColor}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          bannerColor={bannerColor}
          showProjectsPage={showProjectsPage}
        />
        {children}
        <Footer
          data={data}
          fontColor={fontColor}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          backgroundColor={backgroundColor}
          faqsOpen={faqsOpen}
          setFaqsOpen={setFaqsOpen}
        />
      </div>
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
      />
    </div>
  );
}
