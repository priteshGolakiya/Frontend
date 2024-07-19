import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "../utils/summaryAPI";
import defaultImg from "../default.jpg";
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(summaryAPI.common.userDetails.url, {
          withCredentials: true,
        });
        dispatch(setUserDetails(response.data.data));
      } catch (err) {
        dispatch(setUserDetails(null));
        dispatch(setError("Error fetching user details"));
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(summaryAPI.common.getUserCart.url, {
          withCredentials: true,
        });
        dispatch(setCartData(response?.data));
      } catch (err) {
        dispatch(setError("Error fetching cart details"));
      }
    };

    fetchCartData();
  }, [dispatch]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await axios.get(summaryAPI.common.logout.url, { withCredentials: true });
      dispatch(clearUserDetails());
      dispatch(clearCart());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // const searchHendlear = (e) => {
  //   const { value } = e.target;
  //   if (value) {
  //     navigate(`/search?q=${value}`);
  //   } else {
  //     navigate(`/search`);
  //   }
  // };

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        navigate(`/search?q=${searchTerm}`);
      }
      setSearchTerm("");
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [navigate, searchTerm]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };
  return (
    <header>
      <nav className="navbar-container bg-white fixed shadow-lg w-full z-50">
        <div className="flex items-center justify-between w-full py-4 px-4 md:px-10 text-lg text-gray-700">
          <div className="flex items-center">
            <Link to="/" className="mr-4 text-xl font-bold">
              Logo
            </Link>
            <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
              <i
                className={`fas ${
                  isOpen ? "fa-times" : "fa-bars"
                } text-gray-600`}
              ></i>
            </div>
          </div>

          <div
            className={`md:flex items-center ${
              isOpen ? "block" : "hidden"
            } w-full md:w-auto`}
          >
            <div className="relative mx-4 my-2 md:my-0">
              {/* <input
                type="text"
                placeholder="Search"
                onChange={searchHendlear}
                className="w-full pl-8 pr-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              /> */}
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <Link
              to="/cart"
              className="relative flex items-center cursor-pointer"
            >
              <i className="fas fa-shopping-cart text-gray-600"></i>
              {cart.items.length > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -top-4 -right-3">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>
            <div className="relative flex items-center cursor-pointer">
              {user ? (
                <div onClick={toggleDropdown} className="relative">
                  <img
                    src={user.profilePic || defaultImg}
                    alt={user.username || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
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
          </div>
        </div>

        {/* Responsive Menu */}
        <div
          className={`md:hidden ${
            isOpen ? "block" : "hidden"
          } bg-white text-gray-700 absolute top-16 left-0 right-0 z-50`}
        >
          <Link to="/" className="block py-2 px-4 border-b border-gray-200">
            Home
          </Link>
          <Link to="/shop" className="block py-2 px-4 border-b border-gray-200">
            Shop
          </Link>
          <Link
            to="/about"
            className="block py-2 px-4 border-b border-gray-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 px-4 border-b border-gray-200"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
