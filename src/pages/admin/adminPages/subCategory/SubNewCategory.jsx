import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "../../../../utils/summaryAPI";
import subcategoryOptionsDataOrignale from "../../../../utils/subcategoryOptionsData";

// Move the subcategoryOptionsData object outside the component

const SubNewCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(false);

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
        setName(selectedSubcategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedSubcategory]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    const selectedCategoryName = selectedCategory?.name;
    const subcategories =
      subcategoryOptionsDataOrignale[selectedCategoryName] || [];

    setSelectedCategory(selectedCategoryId);
    setSelectedSubcategory(subcategories[0] || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !selectedCategory || !selectedSubcategory) {
      toast.error("Please select a category, subcategory, and enter a name.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${summaryAPI.admin.createSubcategory.url}/${selectedCategory}/`,
        { name },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setName("");
      setSelectedCategory("");
      setSelectedSubcategory("");
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Error creating subcategory: ${error.message}`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Subcategory</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2">
            Select Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded p-2 w-full"
            required
          >
            <option value="">Select a category</option>
            {loading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
        {selectedCategory &&
          subcategoryOptionsDataOrignale[
            categories.find((category) => category._id === selectedCategory)
              ?.name
          ]?.length > 0 && (
            <div className="mb-4">
              <label htmlFor="subcategory" className="block mb-2">
                Select Subcategory:
              </label>
              <select
                id="subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Select a subcategory</option>
                {subcategoryOptionsDataOrignale[
                  categories.find(
                    (category) => category._id === selectedCategory
                  )?.name
                ]?.map((subcategory, index) => (
                  <option key={`${subcategory}-${index}`} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          )}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Subcategory"}
        </button>
      </form>
    </div>
  );
};

export default SubNewCategory;
