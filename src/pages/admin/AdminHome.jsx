import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import summaryAPI from "../../utils/summaryAPI";
import Preloader from "../../component/Preloader";

const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    subcategories: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [usersResponse, categoriesResponse, subcategoriesResponse] =
        await Promise.all([
          axios.get(summaryAPI.admin.getAllUser.url, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }),
          axios.get(summaryAPI.admin.getAllCategory.url, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }),
          axios.get(summaryAPI.admin.getAllSubcategories.url, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

      const usersCount = usersResponse.data.data.length;
      const categoriesCount = categoriesResponse.data.categories.length;
      const subcategoriesCount =
        subcategoriesResponse.data.subcategories.length;

      setStats({
        users: usersCount,
        categories: categoriesCount,
        subcategories: subcategoriesCount,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {loading ? (
          <div className="flex justify-center ml-auto mr-auto">
            <Preloader />
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:scale-105 transform transition-transform duration-300">
              <h2 className="text-xl font-semibold mb-2">Number of Users</h2>
              <p className="text-4xl font-bold">{stats.users - 1}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:scale-105 transform transition-transform duration-300">
              <h2 className="text-xl font-semibold mb-2">
                Number of Categories
              </h2>
              <p className="text-4xl font-bold">{stats.categories}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:scale-105 transform transition-transform duration-300">
              <h2 className="text-xl font-semibold mb-2">
                Number of Subcategories
              </h2>
              <p className="text-4xl font-bold">{stats.subcategories}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="col-span-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 focus:outline-none"
            >
              Refresh Statistics
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
