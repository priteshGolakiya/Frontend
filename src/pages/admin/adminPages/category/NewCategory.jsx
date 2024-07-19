import { useState } from "react";
import axios from "axios";
import summaryAPI from "../../../../utils/summaryAPI";
import { toast } from "react-toastify";

// const categories = [
//   "Apparel & Accessories",
//   "Electronics",
//   "Home & Garden",
//   "Health & Beauty",
//   "Toys & Games",
//   "Books & Media",
//   "Sports & Outdoors",
//   "Automotive",
//   "Baby & Kids",
//   "Food & Grocery",
//   "Pet Supplies",
//   "Office Supplies",
//   "Jewelry & Watches",
//   "Crafts & DIY",
//   "Art & Collectibles",
//   "Travel & Luggage",
//   "Fitness & Wellness",
//   "Home Improvement",
//   "Electronics Accessories",
//   "Gifts & Occasions",
//   "Music & Instruments",
//   "Party Supplies",
//   "Services",
// ];

const categories = [
  "Apparel & Accessories",
  "Electronics",
  "Home & Garden",
  "Health & Beauty",
  "Toys & Games",
  "Books & Media",
  "Baby & Kids",
  "Office Supplies",
  "Travel & Luggage",
  "Fitness & Wellness",
  "Home Improvement",
  "Electronics Accessories",
  "Music & Instruments",
];

const NewCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        summaryAPI.admin.createCategory.url,
        {
          name: selectedCategory,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      console.log("New Category Submitted:", selectedCategory);
      setSelectedCategory("");
      toast.success("New Category Submitted: " + selectedCategory);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create category. Please try again later.";
      console.error("Error creating category:", errorMessage);
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Choose a category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-block bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300"
          disabled={!selectedCategory || loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default NewCategory;
