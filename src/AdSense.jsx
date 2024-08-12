import { useEffect } from "react";

const AdSense = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8239493855484450"
      data-ad-slot="4566419322"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;
