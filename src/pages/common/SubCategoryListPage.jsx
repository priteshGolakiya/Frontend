import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import summaryAPI from "../../utils/summaryAPI";
import Preloader from "../../component/Preloader";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Filters from "../../component/common/Filters";

const SubCategoryListPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [ratingFilter, setRatingFilter] = useState("");
  const [discountFilter, setDiscountFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${summaryAPI.common.getSubcategoryById.url}/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          setData(response.data.products);
          setSubcategory(response.data.subcategory);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "N/A";
  };

  const applyFilters = (products) => {
    let filteredProducts = [...products];

    if (priceRange.min !== "" && priceRange.max !== "") {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price - product.discountPrice >= Number(priceRange.min) &&
          product.price - product.discountPrice <= Number(priceRange.max)
      );
    }

    if (ratingFilter !== "") {
      filteredProducts = filteredProducts.filter(
        (product) => product.averageRating >= Number(ratingFilter)
      );
    }

    if (discountFilter !== "") {
      filteredProducts = filteredProducts.filter(
        (product) =>
          (product.discountPrice / product.price) * 100 >=
          Number(discountFilter)
      );
    }

    if (sortOrder === "lowToHigh") {
      filteredProducts.sort(
        (a, b) => a.price - a.discountPrice - (b.price - b.discountPrice)
      );
    } else if (sortOrder === "highToLow") {
      filteredProducts.sort(
        (a, b) => b.price - b.discountPrice - (a.price - a.discountPrice)
      );
    }

    return filteredProducts;
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const filteredProducts = applyFilters(data);

  const clearFilter = () => {
    setSortOrder("");
    setPriceRange({ min: "", max: "" });
    setRatingFilter("");
    setDiscountFilter("");
  };
  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="text-2xl font-bold mb-4">{subcategory?.name}</h1>
      {data.length === 0 ? (
        <div className="text-gray-500">
          No products available in this subcategory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <Filters
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
                discountFilter={discountFilter}
                setDiscountFilter={setDiscountFilter}
                clearFilter={clearFilter}
              />
            </div>
          </div>

          <div className="md:col-span-3 h-[calc(100vh-200px)] overflow-y-scroll scrollbar-hidden">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="block mb-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex">
                  <div className="w-40 h-40 mr-4 flex-shrink-0">
                    {product.images && product.images.length > 0 && (
                      <PhotoProvider>
                        <PhotoView src={product.images[0]}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </PhotoView>
                      </PhotoProvider>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm bg-green-500 text-white px-1.5 py-0.5 rounded">
                        {formatPrice(product.averageRating)} ★
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.numberOfRatings} ratings)
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                      <li>{product.brand}</li>
                    </ul>
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        ₹{formatPrice(product.price - product.discountPrice)}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-green-600 ml-2">
                        {Math.round(
                          (product.discountPrice / product.price) * 100
                        )}
                        % off
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Free delivery</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryListPage;
