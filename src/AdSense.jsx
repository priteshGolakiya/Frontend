import { useEffect } from "react";

const AdSense = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      } else {
        console.log("AdSense is blocked or not available.");
      }
    } catch (error) {
      console.log("AdSense error: ", error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-8239493855484450"
      data-ad-slot="4566419322"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;
