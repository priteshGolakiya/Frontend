import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import summaryAPI from "../utils/summaryAPI";

const MenuNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const token = useSelector((store) => store.user.token);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(summaryAPI.common.getAllCategory.url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCategories(response.data.products);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (error) {
        setError(`Error fetching categories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, product) => {
      const categoryId = product.category._id;
      if (!acc[categoryId]) {
        acc[categoryId] = { ...product.category, subcategories: [] };
      }
      if (
        !acc[categoryId].subcategories.some(
          (sub) => sub._id === product.subcategory._id
        )
      ) {
        acc[categoryId].subcategories.push(product.subcategory);
      }
      return acc;
    }, {});
  }, [categories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || Object.keys(groupedCategories).length === 0) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || "No categories found."}
      </div>
    );
  }

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {Object.values(groupedCategories).map((category) => (
                  <div key={category._id} className="relative group">
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out"
                    >
                      {category.name}
                      <i className="fa-solid fa-chevron-down ml-1 h-4 w-4"></i>
                    </button>
                    <div className="absolute z-10 left-0 mt-2 w-56 opacity-0 transform scale-95 transition duration-150 ease-in-out origin-top-right group-hover:opacity-100 group-hover:scale-100">
                      <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory._id}
                              to={`/category/${category._id}/subcategory/${subcategory._id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 transition duration-150 ease-in-out"
                              role="menuitem"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {Object.values(groupedCategories).map((category) => (
            <div key={category._id}>
              <button
                onClick={() => toggleCategory(category._id)}
                className="text-white hover:bg-indigo-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium w-full text-left justify-between items-center"
              >
                {category.name}

                <i
                  className={`fa-solid fa-chevron-down h-5 w-5 transition-transform duration-200 ${
                    activeCategory === category._id
                      ? "transform rotate-180"
                      : ""
                  }`}
                ></i>
              </button>
              {activeCategory === category._id && (
                <div className="pl-4 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory._id}
                      to={`/category/${category._id}/subcategory/${subcategory._id}`}
                      className="text-indigo-100 hover:bg-indigo-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MenuNavbar;
