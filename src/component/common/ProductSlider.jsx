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

const ProductSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(summaryAPI.common.getAllCategory.url, {
          withCredentials: true,
        });
        if (response.data.success) {
          const allProducts = response.data.products;

          // Group products by category
          const groupedByCategory = allProducts.reduce((acc, product) => {
            if (!acc[product.category._id]) {
              acc[product.category._id] = [];
            }
            acc[product.category._id].push(product);
            return acc;
          }, {});

          // Select a random product from each category
          const randomProducts = Object.values(groupedByCategory).map(
            (products) => {
              const randomIndex = Math.floor(Math.random() * products.length);
              return products[randomIndex];
            }
          );

          setCategories(randomProducts);
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
  }, []);

  if (loading) {
    return (
      <div>
        <Preloader />
      </div>
    );
  }

  if (error || categories.length === 0) {
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
        {categories.map((product) => (
          <SwiperSlide
            key={product._id}
            className="flex p-10 flex-col items-center"
          >
            <Link
              to={`/category/${product.category._id}`}
              onClick={scrollTop}
              className="w-full h-52 object-contain mb-4 rounded-lg shadow-lg"
            >
              <img
                src={product.images[0]}
                alt={product.category.name}
                className="w-full h-full object-contain mb-4 rounded-lg shadow-lg mix-blend-multiply"
              />
            </Link>
            <p className="text-lg font-semibold text-center">
              {product.category.name}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
