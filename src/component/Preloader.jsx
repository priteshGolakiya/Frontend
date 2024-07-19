import { useEffect, useState } from "react";

const Preloader = () => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const text = "Loading...";
    setLetters(text.split(""));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="text-6xl text-gray-800 font-bold uppercase flex"
        aria-live="polite"
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-fadeIn"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
