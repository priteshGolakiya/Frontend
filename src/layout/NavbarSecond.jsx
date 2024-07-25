import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setUserDetails, clearUserDetails } from "../redux/slices/userSlice";
import { clearCart, setCartData } from "../redux/slices/cartSlice";
import summaryAPI from "../utils/summaryAPI";
import defaultImg from "../default.jpg";
import LOGO from "../assest/1.png";

const NavbarSecond = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart);
  const token = useSelector((state) => state.user.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchCartData();
    fetchCategories();
  }, []);

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
      setError("Error fetching user details");
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
      setError("Error fetching cart details");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(summaryAPI.common.getAllCategory.url, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCategories(response.data.products);
      } else {
        console.error("Failed to fetch categories:", response.data);
        setError("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
      setIsSearchOpen(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center text-xl">
          {error || "An error occurred."}
        </div>
      </div>
    );
  }

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={LOGO} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {Object.values(groupedCategories).map((category) => (
              <div key={category._id} className="relative group">
                <button className="text-gray-600 hover:text-gray-900">
                  {category.name}
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute z-10 left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory._id}
                      to={`/subcategory/${subcategory._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Search, Cart, and User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-search"></i>
              </button>
              {isSearchOpen && (
                <form onSubmit={handleSearch} className="absolute right-0 mt-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="p-2 border rounded-md"
                  />
                </form>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-gray-600 hover:text-gray-900 relative"
            >
              <i className="fas fa-shopping-cart"></i>
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.profilePic || defaultImg}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-600">{user.username}</span>
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin-panel"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {Object.values(groupedCategories).map((category) => (
              <div key={category._id}>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  {category.name}
                </button>
                <div className="pl-4">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory._id}
                      to={`/subcategory/${subcategory._id}`}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarSecond;
