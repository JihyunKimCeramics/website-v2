import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import Faqs from "./Faqs";

export default function Layout({ data, children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const fontColor = data.data.theme.textColour;
  const backgroundColor = data.data.theme.backgroundColour;
  const buttonColor = data.data.theme.buttonColour;
  const buttonHoverColor = data.data.theme.buttonHoverColour;
  const bannerColor = data.data.header.bannerColour;
  const isPopupOpen = mobileMenuOpen || faqsOpen;
  const showProjectsPage = data.data.projectsPage.showProjectsPage;
  const showExhibitionsPage = data.data.exhibitionsPage.showExhibitionsPage;
  const showShopPage = data.data.shopPage.showShopPage;
  const showAboutPage = data.data.aboutPage.showAboutPage;
  const titleFont = data.data.header.titleFont;
  const titleFontWeight = data.data.header.titleFontWeight;
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
      style={{ opacity, color: fontColor, backgroundColor, minWidth: "315px" }}
      className="relative"
    >
      <div className="pb-16 lg:pb-24 transition-all duration-300">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          fontColor={fontColor}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          bannerColor={bannerColor}
          showProjectsPage={showProjectsPage}
          showExhibitionsPage={showExhibitionsPage}
          showShopPage={showShopPage}
          showAboutPage={showAboutPage}
          header={data.data.header}
          showBanner={data.data.header.showBanner}
          bannerText={data.data.header.bannerText}
          title={data.data.header.title}
          projectsPageTitle={data.data.projectsPage.title}
          exhibitionsPageTitle={data.data.exhibitionsPage.title}
          shopPageTitle={data.data.shopPage.title}
          shopPageLink={data.data.shopPage.link}
          aboutPageTitle={data.data.aboutPage.title}
          titleFont={titleFont}
          titleFontWeight={titleFontWeight}
        />
        {children}
        <Footer
          fontColor={fontColor}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          backgroundColor={backgroundColor}
          faqsOpen={faqsOpen}
          setFaqsOpen={setFaqsOpen}
          signupToggle={data.data.footer.signup.toggle}
          thankYouMessage={data.data.footer.signup.thankYouMessage}
          signUp={data.data.footer.signup}
          signupText={data.data.footer.signup.text}
          signupPlaceholder={data.data.footer.signup.placeholder}
          instaToggle={data.data.footer.insta.toggle}
          instaLink={data.data.footer.insta.link}
          contactToggle={data.data.footer.contact.toggle}
          contactEmail={data.data.footer.contact.email}
          contactText={data.data.footer.contact.text}
          faqsToggle={data.data.footer.faqs.toggle}
          faqsText={data.data.footer.faqs.text}
          bottomTextToggle={data.data.footer.bottomText.toggle}
          bottomTextText={data.data.footer.bottomText.text}
          footer={data.data.footer}
        />
      </div>
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
        showProjectsPage={showProjectsPage}
        projectsPageTitle={data.data.projectsPage.title}
        showExhibitionsPage={showExhibitionsPage}
        exhibitionsPageTitle={data.data.exhibitionsPage.title}
        showShopPage={showShopPage}
        shopPageTitle={data.data.shopPage.title}
        shopPageLink={data.data.shopPage.link}
        showAboutPage={showAboutPage}
        aboutPageTitle={data.data.aboutPage.title}
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
