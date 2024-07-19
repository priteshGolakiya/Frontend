/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";
import scrollTop from "../../utils/scrollTop";
import { memo } from "react";

const formatPrice = (price) => {
  return typeof price === "number" ? price.toFixed(2) : "N/A";
};

const MemoizedProductList = memo(({ products, lastProductRef }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map((product, index) => (
      <div
        key={product._id}
        ref={index === products.length - 1 ? lastProductRef : null}
        className="border border-gray-200 rounded-lg overflow-hidden shadow-lg"
      >
        <PhotoProvider>
          <PhotoView src={product.images[0]}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-contain cursor-pointer mix-blend-multiply"
            />
          </PhotoView>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-1">Brand: {product.brand}</p>
            <p className="text-green-700 font-bold mb-1">
              Price: ₹{formatPrice(product.finalPrice)}
            </p>
            <Link
              to={`/products/${product._id}`}
              onClick={scrollTop}
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center text-sm"
            >
              View Product
            </Link>

            <div className="flex mt-2 cursor-pointer">
              {product.images.length > 1 && (
                <PhotoView src={product.images[1]}>
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-gray-600">
                    +{product.images.length - 1}
                  </div>
                </PhotoView>
              )}
              {product.images.slice(2).map((image, index) => (
                <PhotoView key={index + 1} src={image} />
              ))}
            </div>
          </div>
        </PhotoProvider>
      </div>
    ))}
  </div>
));

export default MemoizedProductList;
