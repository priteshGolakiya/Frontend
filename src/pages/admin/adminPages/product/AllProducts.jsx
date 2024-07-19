import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import summaryAPI from "../../../../utils/summaryAPI";
import Preloader from "../../../../component/Preloader";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal ";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(summaryAPI.admin.getAllProducts.url, {
        withCredentials: true,
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(summaryAPI.admin.getAllCategory.url, {
        withCredentials: true,
      });
      setCategories(response.data.categories);
      setSubcategories(response.data.subcategories);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
    }
  };

  const handleOpenModal = (product, editMode = false) => {
    setSelectedProduct(product);
    setIsEditMode(editMode);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditMode && selectedProduct) {
        await axios.put(
          `${summaryAPI.admin.updateProduct.url}/${selectedProduct._id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        await axios.post(summaryAPI.admin.createProduct.url, formData, {
          withCredentials: true,
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error("Error creating/updating product", err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${summaryAPI.admin.deleteProduct.url}/${productId}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully", { autoClose: 3000 });
      fetchProducts(); // Refresh product table
    } catch (err) {
      toast.error("Failed to delete product", { autoClose: 3000 });
      console.error("Error deleting product", err.message);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="text-lg font-semibold text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-5 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
        onClick={() => navigate("/admin-panel/products/add")}
      >
        Add New Product
      </button>
      <ProductTable
        products={products}
        categories={categories}
        subcategories={subcategories}
        onEdit={handleOpenModal}
        onDelete={handleDeleteProduct}
      />
      <ProductModal
        isOpen={!!selectedProduct || isEditMode}
        onClose={handleCloseModal}
        product={selectedProduct}
        isEditMode={isEditMode}
        categories={categories}
        subcategories={subcategories}
        onSubmit={handleFormSubmit}
        refreshProducts={fetchProducts}
      />
    </div>
  );
};

export default AllProducts;
