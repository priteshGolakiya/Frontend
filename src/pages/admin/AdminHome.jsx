import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import summaryAPI from "../../utils/summaryAPI";
import Preloader from "../../component/Preloader";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    subcategories: 0,
    reviews: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = useSelector((store) => store.user.token);

  const fetchStats = async () => {
    try {
      const [
        usersResponse,
        categoriesResponse,
        subcategoriesResponse,
        productsResponse,
        ordersResponse,
      ] = await Promise.all([
        axios.get(summaryAPI.admin.getAllUser.url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(summaryAPI.admin.getAllCategory.url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(summaryAPI.admin.getAllSubcategories.url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(summaryAPI.admin.getAllProducts.url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(summaryAPI.admin.getAllOrders.url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let totalReviews = 0;
      productsResponse.data.forEach((product) => {
        totalReviews += product.reviews.length;
      });

      setStats({
        users: usersResponse.data.data.length - 1, // Subtracting 1 as per your original code
        categories: categoriesResponse.data.categories.length,
        subcategories: subcategoriesResponse.data.subcategories.length,
        reviews: totalReviews,
        products: productsResponse.data.length,
        orders: ordersResponse.data.length,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <Preloader />
          </div>
        ) : (
          <>
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Number of {key.charAt(0).toUpperCase() + key.slice(1)}
                </h2>
                <p className="text-4xl font-bold">{value}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <button
        onClick={handleRefresh}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-6 focus:outline-none"
      >
        Refresh Statistics
      </button>
    </div>
  );
};

export default AdminHome;
