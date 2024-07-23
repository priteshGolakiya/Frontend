import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import summaryAPI from "../../../../utils/summaryAPI";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const token = useSelector((store) => store.user.token);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(summaryAPI.admin.getAllReviews.url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      console.error("AxiosError:", error.toJSON());
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${summaryAPI.admin.deleteReview.url}/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Review deleted successfully");
        fetchReviews();
      } catch (error) {
        toast.error("Error deleting review: " + error.message);
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Customer Reviews
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white  rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {review.product?.name}
                  </h3>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-600">
                    ({review.rating})
                  </span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {review?.review}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.user?.email}</span>
                  <span>{moment(review.date).format("MMM D, YYYY")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
