// import { useEffect, useState } from "react";
// import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
// import summaryAPI from "../../utils/summaryAPI";
import { Pagination, EffectFade, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import Preloader from "../Preloader";

const BannerCarousel = () => {
  // const [categories, setCategories] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const bannersImg = [
    {
      name: "img1",
      images:
        "https://static.vecteezy.com/system/resources/previews/011/871/820/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    },
    {
      name: "img2",
      images:
        "https://static.vecteezy.com/system/resources/previews/004/707/502/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    },
    {
      name: "img3",
      images:
        "https://static.vecteezy.com/system/resources/previews/011/871/813/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    },
    {
      name: "img4",
      images:
        "https://static.vecteezy.com/system/resources/previews/036/073/448/non_2x/concept-for-online-retailing-business-b2c-with-stages-of-online-shopping-choice-discount-delivery-set-of-scenes-with-woman-buying-goods-in-internet-store-e-tailing-e-commerce-banner-for-website-vector.jpg",
    },
    {
      name: "img4",
      images:
        "https://static.vecteezy.com/system/resources/previews/004/299/813/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    },
    {
      name: "img5",
      images:
        "https://i.pinimg.com/736x/b4/6e/b7/b46eb746f7664083877a42aa05062dfe.jpg",
    },
    {
      name: "img5",
      images:
        "https://t4.ftcdn.net/jpg/02/49/50/15/240_F_249501541_XmWdfAfUbWAvGxBwAM0ba2aYT36ntlpH.jpg",
    },
  ];
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(summaryAPI.common.getAllCategory.url, {
  //         withCredentials: true,
  //       });
  //       if (response.data.success) {
  //         setCategories(response.data.products);
  //       } else {
  //         setError("Failed to fetch categories");
  //       }
  //     } catch (error) {
  //       setError("Error fetching categories: " + error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) {
  //   return <Preloader />;
  // }

  // if (error) {
  //   return <p className="text-center mt-4">Error: {error}</p>;
  // }

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      loop={true}
      pagination={{ clickable: true }}
      className="mySwiper"
      navigation={true}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      autoplay={{ delay: 3000 }} // Set autoplay delay to 3000ms (3 seconds)
      style={{ width: "100%" }}
    >
      {bannersImg.map((category, index) => (
        <SwiperSlide key={index}>
          <div className="w-full flex flex-col items-center rounded-lg overflow-hidden shadow-lg">
            <img
              src={category.images}
              alt={category.name}
              className="h-96 object-cover mb-8 w-full mix-blend-multiply"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerCarousel;
