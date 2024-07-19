import { useState, useEffect } from "react";
import axios from "axios";
import summaryAPI from "../../../../utils/summaryAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preloader from "../../../../component/Preloader";

const SubCategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          summaryAPI.admin.getAllSubcategories.url,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSubcategories(response.data.subcategories);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  const handleDelete = async (subcategoryId) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await axios.delete(
          `${summaryAPI.admin.deleteSubcategory.url}/${subcategoryId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSubcategories((prevSubcategories) =>
          prevSubcategories.filter(
            (subcategory) => subcategory._id !== subcategoryId
          )
        );
        toast.success("Subcategory deleted successfully");
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Subcategories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory._id}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{subcategory.name}</h2>
              <button
                onClick={() => handleDelete(subcategory._id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-300"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <p className="text-gray-500">{subcategory.category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryList;
