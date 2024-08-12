import { useEffect } from "react";

const AdSense = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8239493855484450";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    (window.adsbygoogle = window.adsbygoogle || []).push({});

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8239493855484450"
      data-ad-slot="4566419322"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;
