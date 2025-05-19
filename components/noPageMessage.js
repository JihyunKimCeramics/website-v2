const NoPageMessage = ({ buttonColour, buttonHoverColour }) => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 rounded-full"
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
