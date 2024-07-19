import { useEffect, useState } from "react";
import axios from "axios";
import summaryAPI from "../../../../utils/summaryAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preloader from "../../../../component/Preloader";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(summaryAPI.admin.getAllCategory.url, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCategories(response.data.categories);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This Will delete Sub-category and Related Products"
      )
    ) {
      try {
        await axios.delete(
          `${summaryAPI.admin.deleteCategory.url}/${categoryId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId)
        );
        toast.success("Category deleted successfully");
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
    <div className="container mx-auto p-3">
      <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-300"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            {category.subcategories && category.subcategories.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {category.subcategories.map((sub) => (
                  <li key={sub._id} className="ml-4">
                    {sub.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No subcategories</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
