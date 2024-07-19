import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "../../../../utils/summaryAPI";
import uploadImage from "../../../../utils/uploadImage";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    images: [],
    category: "",
    subcategory: "",
    features: "",
    offers: "",
    deliveryOptions: "",
    finalPrice: 0,
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(summaryAPI.admin.getAllCategory.url, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === "file" ? e.target.files : e.target.value;

    if (type === "file") {
      const files = Array.from(e.target.files);
      const previews = files.map((file) => URL.createObjectURL(file));
      const imagesWithIds = files.map((file, index) => ({
        id: Date.now() + index,
        file,
      }));
      setImagePreviews((prev) => [...prev, ...previews]);
      setProductData((prevData) => ({
        ...prevData,
        [name]: [...prevData.images, ...imagesWithIds],
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = (id) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => productData.images[index].id !== id)
    );
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((image) => image.id !== id),
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    const subcategories = selectedCategory?.subcategories || [];

    setProductData((prevData) => ({
      ...prevData,
      category: selectedCategoryId,
      subcategory: "",
    }));
    setSubcategories(subcategories);
  };

  const handleSubcategoryChange = (e) => {
    setProductData((prevData) => ({
      ...prevData,
      subcategory: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!productData.name) errors.name = "Name is required";
    if (!productData.price) errors.price = "Price is required";
    if (!productData.stock) errors.stock = "Stock is required";
    if (!productData.category) errors.category = "Category is required";
    if (!productData.offers) errors.offers = "Offers are required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setProductData({
      name: "",
      brand: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      images: [],
      category: "",
      subcategory: "",
      features: "",
      offers: "",
      deliveryOptions: "",
      finalPrice: 0,
    });
    setImagePreviews([]);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const uploadedImages = await Promise.all(
        productData.images.map((image) => uploadImage(image.file))
      );

      const imageURLs = uploadedImages.map((response) => response.secure_url);

      // Convert offers to a comma-separated string
      const offersString = productData.offers.split(",").map((offer) => offer.trim()).join(", ");

      const payload = {
        ...productData,
        images: imageURLs,
        offers: offersString,  // Convert offers array to string
        subcategory: productData.subcategory || null,
      };

      const response = await axios.post(
        summaryAPI.admin.createProduct.url,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Product added successfully:", response.data);
      toast.success("Product added successfully");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Basic Information</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Brand", name: "brand", type: "text" },
              { label: "Description", name: "description", type: "textarea" },
              { label: "Price", name: "price", type: "number" },
              {
                label: "Discount Price",
                name: "discountPrice",
                type: "number",
              },
              { label: "Stock", name: "stock", type: "number" },
              { label: "Features", name: "features", type: "text" },
              { label: "Offers", name: "offers", type: "text" },
              {
                label: "Delivery Options",
                name: "deliveryOptions",
                type: "text",
              },
            ].map(({ label, name, type }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm text-gray-600">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    name={name}
                    value={productData[name]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[name] ? "border-red-500" : ""
                    }`}
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={type !== "file" ? productData[name] : undefined}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[name] ? "border-red-500" : ""
                    }`}
                  />
                )}
                {errors[name] && (
                  <span className="text-red-500 text-sm">{errors[name]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Images</label>
          <input
            type="file"
            name="images"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            multiple
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {imagePreviews.map((src, index) => (
              <div
                key={productData.images[index].id}
                className="relative group"
              >
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-24 w-24 object-cover border rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(productData.images[index].id)
                  }
                  className="absolute top-2 right-2 bg-red-600 cursor-pointer bg-opacity-70 text-white p-1 rounded-full focus:outline-none transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleCategoryChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? "border-red-500" : ""
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">{errors.category}</span>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Subcategory</label>
          <select
            name="subcategory"
            value={productData.subcategory}
            onChange={handleSubcategoryChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subcategory ? "border-red-500" : ""
            }`}
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <span className="text-red-500 text-sm">{errors.subcategory}</span>
          )}
        </div>
        <div className="flex items-center gap-4 mb-6">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
          {/* <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md focus:outline-none"
          >
            Reset Form
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
