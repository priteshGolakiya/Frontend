import { useState } from "react";
import {
  FaBars,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  // FaInfo,
  FaList,
  // FaMapMarkerAlt,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaTags,
  FaTimes,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import defaultImg from "../../default.jpg";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dropdowns, setDropdowns] = useState({
    products: false,
    categories: false,
    users: false,
    orders: false,
    subcategories: false,
  });

  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center p-2 rounded bg-blue-600 text-white"
      : "flex items-center p-2 rounded hover:bg-blue-600 hover:text-white transition-colors duration-300";
  };

  return (
    <div className="min-h-screen h-[calc(100vh-200px)] overflow-hidden flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800  text-gray-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
        aria-expanded={isSidebarOpen}
      >
        <div className="flex justify-between items-center p-4">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
          {isSidebarOpen && (
            <span className="text-xl font-semibold">Admin Panel</span>
          )}
        </div>
        <div className="overflow-y-auto h-[calc(100vh-50px)] scrollbar-hidden">
          <nav className="mt-4">
            <ul>
              <li className="mb-2">
                <Link
                  to="/admin-panel"
                  className={getLinkClass("/admin-panel")}
                >
                  <FaUserShield className="mr-2" />
                  {isSidebarOpen && "Dashboard"}
                </Link>
              </li>
              <li className="mb-2">
                <div
                  className="flex items-center p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  onClick={() => toggleDropdown("users")}
                  aria-haspopup="true"
                  aria-expanded={dropdowns.users}
                >
                  <FaUser className="mr-2" />
                  {isSidebarOpen && <span>Users</span>}
                  {isSidebarOpen && (
                    <span className="ml-auto">
                      {dropdowns.users ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>
                {dropdowns.users && (
                  <ul className={`${isSidebarOpen ? "ml-4" : "ml-0"}`}>
                    <li>
                      <Link
                        to="/admin-panel/users/all-users"
                        className={getLinkClass("/admin-panel/users/all-users")}
                      >
                        <FaList className="mr-2" />
                        {isSidebarOpen && "Users List"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin-panel/users/new"
                        className={getLinkClass("/admin-panel/users/new")}
                      >
                        <FaPlus className="mr-2" />
                        {isSidebarOpen && "Add New User"}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-2">
                <div
                  className="flex items-center p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  onClick={() => toggleDropdown("products")}
                  aria-haspopup="true"
                  aria-expanded={dropdowns.products}
                >
                  <FaBoxOpen className="mr-2" />
                  {isSidebarOpen && <span>Products</span>}
                  {isSidebarOpen && (
                    <span className="ml-auto">
                      {dropdowns.products ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>
                {dropdowns.products && (
                  <ul className={`${isSidebarOpen ? "ml-4" : "ml-0"}`}>
                    <li>
                      <Link
                        to="/admin-panel/products/all-products"
                        className={getLinkClass(
                          "/admin-panel/products/all-products"
                        )}
                      >
                        <FaList className="mr-2" />
                        {isSidebarOpen && "Products List"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin-panel/products/add"
                        className={getLinkClass("/admin-panel/products/add")}
                      >
                        <FaPlus className="mr-2" />
                        {isSidebarOpen && "Add Product"}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-2">
                <div
                  className="flex items-center p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  onClick={() => toggleDropdown("categories")}
                  aria-haspopup="true"
                  aria-expanded={dropdowns.categories}
                >
                  <FaTags className="mr-2" />
                  {isSidebarOpen && <span>Categories</span>}
                  {isSidebarOpen && (
                    <span className="ml-auto">
                      {dropdowns.categories ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  )}
                </div>
                {dropdowns.categories && (
                  <ul className={`${isSidebarOpen ? "ml-4" : "ml-0"}`}>
                    <li>
                      <Link
                        to="/admin-panel/category/list"
                        className={getLinkClass("/admin-panel/category/list")}
                      >
                        <FaList className="mr-2" />
                        {isSidebarOpen && "Category List"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin-panel/category/new"
                        className={getLinkClass("/admin-panel/category/new")}
                      >
                        <FaPlus className="mr-2" />
                        {isSidebarOpen && "New Category"}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-2">
                <div
                  className="flex items-center p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  onClick={() => toggleDropdown("subcategories")}
                  aria-haspopup="true"
                  aria-expanded={dropdowns.subcategories}
                >
                  <FaTags className="mr-2" />
                  {isSidebarOpen && <span>Sub Categories</span>}
                  {isSidebarOpen && (
                    <span className="ml-auto">
                      {dropdowns.subcategories ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  )}
                </div>
                {dropdowns.subcategories && (
                  <ul className={`${isSidebarOpen ? "ml-4" : "ml-0"}`}>
                    <li>
                      <Link
                        to="/admin-panel/sub-category/list"
                        className={getLinkClass(
                          "/admin-panel/sub-category/list"
                        )}
                      >
                        <FaList className="mr-2" />
                        {isSidebarOpen && "Sub Category List"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin-panel/sub-category/new"
                        className={getLinkClass(
                          "/admin-panel/sub-category/new"
                        )}
                      >
                        <FaPlus className="mr-2" />
                        {isSidebarOpen && "New Sub Category"}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-2">
                <div
                  className="flex items-center p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                  onClick={() => toggleDropdown("orders")}
                  aria-haspopup="true"
                  aria-expanded={dropdowns.orders}
                >
                  <FaShoppingCart className="mr-2" />
                  {isSidebarOpen && <span>Orders</span>}
                  {isSidebarOpen && (
                    <span className="ml-auto">
                      {dropdowns.orders ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>
                {dropdowns.orders && (
                  <ul className={`${isSidebarOpen ? "ml-4" : "ml-0"}`}>
                    <li>
                      <Link
                        to="/admin-panel/orders/list"
                        className={getLinkClass("/admin-panel/orders/list")}
                      >
                        <FaList className="mr-2" />
                        {isSidebarOpen && "Order List"}
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/admin-panel/orders/detail"
                        className={getLinkClass("/admin-panel/orders/detail")}
                      >
                        <FaInfo className="mr-2" />
                        {isSidebarOpen && "Order Detail"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin-panel/orders/tracking"
                        className={getLinkClass("/admin-panel/orders/tracking")}
                      >
                        <FaMapMarkerAlt className="mr-2" />
                        {isSidebarOpen && "Order Tracking"}
                      </Link>
                    </li> */}
                  </ul>
                )}
              </li>
              <li className="mb-2">
                <Link
                  to="/admin-panel/review"
                  className={getLinkClass("/admin-panel/review")}
                >
                  <FaStar className="mr-2" />
                  {isSidebarOpen && "Reviews"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex  flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">Welcome, {user.username}</span>
                <img
                  src={user.profilePic || defaultImg}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              </>
            ) : (
              <FaUser className="text-2xl text-gray-600" />
            )}
          </div>
        </header>
        <main className="flex-1 h-[calc(100vh-200px)] overflow-y-scroll scrollbar-hidden m-5 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
