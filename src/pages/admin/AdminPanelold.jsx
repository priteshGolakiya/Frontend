/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
  FaCogs,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaList,
  FaPlus,
  FaUserPlus,
  FaInfo,
  FaMapMarkerAlt,
  FaTags,
  FaUserShield,
  FaStar,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import defaultImg from "../../default.jpg";

const AdminPanelold = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isSubCategoriesDropdownOpen, setIsSubCategoriesDropdownOpen] =
    useState(false);

  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      setIsProductsDropdownOpen(false);
      setIsCategoriesDropdownOpen(false);
      setIsOrdersDropdownOpen(false);
      setIsUsersDropdownOpen(false);
    }
  };

  const toggleDropdown = (dropdownStateSetter) => {
    dropdownStateSetter((prevState) => !prevState);
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center p-2 rounded bg-blue-600 text-white"
      : "flex items-center p-2 rounded hover:bg-blue-600 hover:text-white transition-colors duration-300";
  };

  const SidebarLink = ({ to, icon, label }) => (
    <li className="mb-2">
      <Link to={to} className={getLinkClass(to)}>
        {icon && <span className="mr-2">{icon}</span>}
        {isSidebarOpen && label}
      </Link>
    </li>
  );

  const SidebarDropdown = ({
    icon,
    label,
    isOpen,
    toggleDropdown,
    children,
  }) => (
    <li className="mb-2">
      <div
        className="flex items-center p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
        onClick={isSidebarOpen ? toggleDropdown : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {isSidebarOpen && <span>{label}</span>}
        {isSidebarOpen && (
          <span className="ml-auto">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        )}
      </div>
      {(isOpen || !isSidebarOpen) && (
        <ul className={`${isSidebarOpen ? "ml-4" : "ml-0"}`}>{children}</ul>
      )}
    </li>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-slate-800 text-gray-300 ${
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
        <div className="overflow-y-auto h-[calc(100vh-100px)] scrollbar-hidden">
          <nav className="mt-4">
            <ul>
              <SidebarLink
                to="/admin-panel"
                icon={<FaUserShield />}
                label="Dashboard"
              />
              <SidebarDropdown
                icon={<FaUser />}
                label="Users"
                isOpen={isUsersDropdownOpen}
                toggleDropdown={() => toggleDropdown(setIsUsersDropdownOpen)}
              >
                <SidebarLink
                  to="/admin-panel/users/all-users"
                  icon={<FaUsers />}
                  label="Users List"
                />
                <SidebarLink
                  to="/admin-panel/users/new"
                  icon={<FaUserPlus />}
                  label="Add New User"
                />
              </SidebarDropdown>
              <SidebarDropdown
                icon={<FaBoxOpen />}
                label="Products"
                isOpen={isProductsDropdownOpen}
                toggleDropdown={() => toggleDropdown(setIsProductsDropdownOpen)}
              >
                <SidebarLink
                  to="/admin-panel/products/all-products"
                  icon={<FaList />}
                  label="Products List"
                />
                <SidebarLink
                  to="/admin-panel/products/add"
                  icon={<FaPlus />}
                  label="Add Product"
                />
              </SidebarDropdown>
              <SidebarDropdown
                icon={<FaTags />}
                label="Category"
                isOpen={isCategoriesDropdownOpen}
                toggleDropdown={() =>
                  toggleDropdown(setIsCategoriesDropdownOpen)
                }
              >
                <SidebarLink
                  to="/admin-panel/category/list"
                  icon={<FaList />}
                  label="Category List"
                />
                <SidebarLink
                  to="/admin-panel/category/new"
                  icon={<FaPlus />}
                  label="New Category"
                />
              </SidebarDropdown>
              <SidebarDropdown
                icon={<FaTags />}
                label="Sub Category"
                isOpen={isSubCategoriesDropdownOpen}
                toggleDropdown={() =>
                  toggleDropdown(setIsSubCategoriesDropdownOpen)
                }
              >
                <SidebarLink
                  to="/admin-panel/sub-category/list"
                  icon={<FaList />}
                  label="Sub Category List"
                />
                <SidebarLink
                  to="/admin-panel/sub-category/new"
                  icon={<FaPlus />}
                  label="New Sub Category"
                />
              </SidebarDropdown>
              <SidebarDropdown
                icon={<FaShoppingCart />}
                label="Order"
                isOpen={isOrdersDropdownOpen}
                toggleDropdown={() => toggleDropdown(setIsOrdersDropdownOpen)}
              >
                <SidebarLink
                  to="/admin-panel/orders/list"
                  icon={<FaList />}
                  label="Order List"
                />
                <SidebarLink
                  to="/admin-panel/orders/detail"
                  icon={<FaInfo />}
                  label="Order Detail"
                />
                <SidebarLink
                  to="/admin-panel/orders/tracking"
                  icon={<FaMapMarkerAlt />}
                  label="Order Tracking"
                />
              </SidebarDropdown>
              <SidebarLink
                to="/admin-panel/review"
                icon={<FaStar />}
                label="Review"
              />
              <SidebarLink
                to="/admin-panel/reports"
                icon={<FaChartBar />}
                label="Reports"
              />
              <SidebarLink
                to="/admin-panel/settings"
                icon={<FaCogs />}
                label="Settings"
              />
            </ul>
          </nav>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
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
        <main className="flex-1  p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanelold;
