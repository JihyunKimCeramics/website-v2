const NoPageMessage = ({ buttonColour, buttonHoverColour }) => {
  return (
    <div className="mt-16 lg:mt-24 py-5 flex flex-col items-center justify-center md:w-200 lg:w-300 xl:w-400 md:mx-auto mx-16 sm:mx-28 lg:mx-40 xl:mx-64 text-center">
      <h1 className="text-3xl font-semibold">404 - Page Not Found</h1>
      <p className="mt-2 text-base font-light">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-8 px-5 py-2.5 rounded-full text-sm"
        style={{ backgroundColor: buttonColour }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = buttonHoverColour)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = buttonColour)
        }
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NoPageMessage;
