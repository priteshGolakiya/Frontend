import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "../utils/summaryAPI";
import defaultImg from "../default.jpg";
import LOGO from "../assest/1.png";
import {
  setUserDetails,
  setError,
  clearUserDetails,
} from "../redux/slices/userSlice";
import { clearCart, setCartData } from "../redux/slices/cartSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((store) => store.user.token);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(summaryAPI.common.userDetails.url, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUserDetails(response.data.data));
      } catch (err) {
        dispatch(setUserDetails(null));
        dispatch(setError("Error fetching user details"));
      }
    };

    const fetchCartData = async () => {
      try {
        const response = await axios.get(summaryAPI.common.getUserCart.url, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setCartData(response?.data));
      } catch (err) {
        dispatch(setError("Error fetching cart details"));
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(summaryAPI.common.getAllCategory.url, {
          withCredentials: true,
        });

        if (response.data.success) {
          const products = response.data.products;

          const uniqueCategories = {};
          products.forEach((product) => {
            const { category, subcategory } = product;

            if (category && subcategory) {
              if (!uniqueCategories[category._id]) {
                uniqueCategories[category._id] = {
                  ...category,
                  subcategories: [],
                };
              }

              if (
                !uniqueCategories[category._id].subcategories.some(
                  (sub) => sub._id === subcategory._id
                )
              ) {
                uniqueCategories[category._id].subcategories.push(subcategory);
              }
            }
          });

          setCategories(Object.values(uniqueCategories));
        } else {
          console.error("Failed to fetch categories:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchCartData();
    fetchCategories();
  }, [dispatch, token]);

  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      const categoryId = category._id;
      if (!acc[categoryId]) {
        acc[categoryId] = { ...category, subcategories: [] };
      }
      category.subcategories.forEach((subcategory) => {
        if (
          !acc[categoryId].subcategories.some(
            (sub) => sub._id === subcategory._id
          )
        ) {
          acc[categoryId].subcategories.push(subcategory);
        }
      });
      return acc;
    }, {});
  }, [categories]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await axios.get(summaryAPI.common.logout.url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(clearUserDetails());
      dispatch(clearCart());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        navigate(`/search?q=${searchTerm}`);
      }
      setSearchTerm("");
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [navigate, searchTerm]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  return (
    <header className="fixed w-full z-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img className="h-8 w-auto" src={LOGO} alt="Logo" />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 mx-4">
              <div className="relative w-full max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center">
              <Link to="/cart" className="relative flex items-center mr-4">
                <i className="fas fa-shopping-cart text-gray-600 text-2xl"></i>
                {cart.items.length > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -top-2 -right-2">
                    {cart.totalQuantity}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center"
                  >
                    <img
                      src={user.profilePic || defaultImg}
                      alt={user.username || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                    <i className="fas fa-chevron-down ml-2"></i>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin-panel"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-500 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <i className="fas fa-times"></i>
                ) : (
                  <i className="fas fa-bars"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {/* Mobile Search */}
          <div className="relative w-full max-w-xs mx-auto mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
            </div>
          </div>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="text-blue-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Cart ({cart.totalQuantity})
          </Link>

          {/* User Links */}
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center w-full justify-between px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <img
                      src={user.profilePic || defaultImg}
                      alt={user.username || "User"}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user.username}</span>
                  </div>
                  <i className={`fas fa-chevron-down ml-2`}></i>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin-panel"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-blue-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          )}

          {/* Category Links */}
          {!loading && Object.keys(groupedCategories).length > 0 && (
            <>
              {Object.values(groupedCategories).map((category) => (
                <div key={category._id}>
                  <button
                    onClick={() => toggleCategory(category._id)}
                    className="text-blue-500 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left justify-between items-center"
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
                          to={`/subcategory/${subcategory._id}`}
                          className="text-blue-300 hover:bg-blue-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Category Dropdowns */}
      <nav className="bg-gradient-to-r from-purple-500 to-indigo-600 sm:bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 displayNone">
          <div className="flex items-center justify-center h-14">
            {!loading && Object.keys(groupedCategories).length > 0 && (
              <div className="hidden md:flex items-center space-x-4">
                {Object.values(groupedCategories).map((category) => (
                  <div key={category._id} className="relative group">
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      {category.name}
                      <i className="fa-solid fa-chevron-down ml-1 h-4 w-4"></i>
                    </button>
                    <div className="absolute z-10 left-0 mt-2 w-56 opacity-0 transform scale-95 transition-all duration-200 origin-top-right group-hover:opacity-100 group-hover:scale-100">
                      <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory._id}
                              to={`/subcategory/${subcategory._id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
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
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
