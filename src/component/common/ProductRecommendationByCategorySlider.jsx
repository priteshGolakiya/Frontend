/* eslint-disable react/prop-types */
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

const ProductRecommendationByCategorySlider = ({
  categoryId,
  excludeSubcategoryId,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${summaryAPI.common.getAllCategoryById.url}/${categoryId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.category) {
          const subcategories = response.data.category.subcategories.filter(
            (subcategory) => subcategory._id !== excludeSubcategoryId
          );

          const productsWithSubcategory = subcategories.flatMap((subcategory) =>
            subcategory.products.map((product) => ({
              ...product,
              subcategoryId: subcategory._id,
              subcategoryName: subcategory.name,
            }))
          );

          const shuffled = productsWithSubcategory.sort(
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
  }, [categoryId, excludeSubcategoryId]);

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
      <h2 className="text-2xl font-bold mb-4">Over Other Categories</h2>
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
            <Link
              to={`/subcategory/${product.subcategoryId}`}
              onClick={scrollTop}
              className="w-full h-52 mb-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg shadow-lg"
              />
            </Link>
            <p className="text-lg font-semibold text-center">{product.name}</p>
            <p className="text-sm text-gray-600 text-center">
              {product.subcategoryName}
            </p>
            <p className="text-lg font-bold text-center">
              ₹{product.finalPrice}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductRecommendationByCategorySlider;
