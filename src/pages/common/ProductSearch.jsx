import { Link, useLocation } from "react-router-dom";
import summaryAPI from "../../utils/summaryAPI";
import { useEffect, useState } from "react";
import axios from "axios";
import { PhotoProvider, PhotoView } from "react-photo-view";
import scrollTop from "../../utils/scrollTop";

const ProductSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchProducts = async (query) => {
    try {
      const response = await axios.get(
        `${summaryAPI.common.searchProduct.url}?q=${query}`,
        { withCredentials: true }
      );
      setData(response.data.products || []);
    } catch (error) {
      setError("Error fetching product data: " + error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center text-xl">
          {error || "No product data found."}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Search Results for :- {query}
        </h1>
        {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <PhotoProvider>
                  <PhotoView src={product.images[0]}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-64 object-contain cursor-zoom-in"
                    />
                  </PhotoView>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mb-1">Brand: {product.brand}</p>
                    <p className="text-gray-600 mb-4">
                      Price: ₹{product.price.toLocaleString()}
                    </p>
                    <Link
                      to={`/products/${product._id}`}
                      onClick={scrollTop}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      View Product
                    </Link>

                    <div className="flex mt-4 space-x-2 overflow-x-auto">
                      {product.images.slice(1).map((image, index) => (
                        <PhotoView key={index} src={image}>
                          <img
                            src={image}
                            alt={`${product.name} - Image ${index + 2}`}
                            className="w-16 h-16 object-contain rounded-md cursor-zoom-in"
                          />
                        </PhotoView>
                      ))}
                      {product.images.length > 5 && (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                          +{product.images.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </PhotoProvider>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No Proudect Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
