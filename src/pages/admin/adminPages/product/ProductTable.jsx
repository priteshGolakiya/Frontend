/* eslint-disable react/prop-types */

import { FaEdit, FaTrash } from "react-icons/fa";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-slate-50 p-4 shadow rounded-lg transform hover:scale-105 hover:drop-shadow-xl transition-transform duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <div className="text-lg font-bold text-blue-600">
              ₹{product.finalPrice}
            </div>
          </div>
          <div className="mb-4 cursor-pointer">
            {product.images && product.images.length > 0 && (
              <PhotoProvider>
                <div className="flex flex-wrap gap-2">
                  <PhotoView src={product.images[0]}>
                    <img
                      src={product.images[0]}
                      alt={`Product Image 1`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </PhotoView>
                  {product.images.length > 1 && (
                    <PhotoView src={product.images[1]}>
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-gray-600">
                        +{product.images.length -1}
                      </div>
                    </PhotoView>
                  )}
                </div>
                {product.images.slice(2).map((image, index) => (
                  <PhotoView key={index + 1} src={image} />
                ))}
              </PhotoProvider>
            )}
          </div>
          <div className="mb-4">
            <p>
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ₹{product.price}
            </p>
            {product.discountPrice && (
              <p className="text-green-600">
                <span className="font-semibold">Discount Price:</span> ₹
                {product.discountPrice}
              </p>
            )}
            <p>
              <span className="font-semibold">Stock:</span> {product.stock}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category && product.category.name}
            </p>
            <p>
              <span className="font-semibold">Subcategory:</span>{" "}
              {product.subcategory && product.subcategory.name}
            </p>
            <p>
              <span className="font-semibold">Delivery Options:</span>{" "}
              {product.deliveryOptions}
            </p>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none"
              onClick={() => onEdit(product, true)}
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
              onClick={() => onDelete(product._id)}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;
