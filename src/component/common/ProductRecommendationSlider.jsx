import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import summaryAPI from "../../utils/summaryAPI";
import {
  FreeMode,
  EffectFade,
  Navigation,
  Autoplay,
  Pagination,
} from "swiper/modules";
import Preloader from "../Preloader";
import { Link } from "react-router-dom";
import scrollTop from "../../utils/scrollTop";

// eslint-disable-next-line react/prop-types
const ProductRecommendationSlider = ({ subcategoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!subcategoryId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${summaryAPI.common.getSubcategoryById.url}/${subcategoryId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.products) {
          // Shuffle the products array and take the first 10 (or less if there are fewer products)
          const shuffled = response.data.products.sort(
            () => 0.5 - Math.random()
          );
          const selectedProducts = shuffled.slice(0, 10);
          setProducts(selectedProducts);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId]);

  if (loading) {
    return <Preloader />;
  }

  if (error || products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error || "No products found."}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[EffectFade, Navigation, Pagination, Autoplay, FreeMode]}
        autoplay={{ delay: 3000 }}
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide
            key={product._id}
            className="flex p-10 flex-col items-center"
          >
            <Link to={`/products/${product._id}`} className="w-full h-52 mb-4" onClick={scrollTop}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg shadow-lg"
              />
            </Link>
            <p className="text-lg font-semibold text-center">{product.name}</p>
            <p className="text-md text-gray-600 text-center">
              Brand: {product.brand}
            </p>
            <p className="text-lg font-bold text-center">
              ₹{product.discountPrice}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductRecommendationSlider;
