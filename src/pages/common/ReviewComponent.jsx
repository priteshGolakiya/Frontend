/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import summaryAPI from "../../utils/summaryAPI";
import Preloader from "../../component/Preloader";
import { useSelector } from "react-redux";

const ReviewComponent = ({ onSubmitReview, productId }) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: "",
  });
  const user = useSelector((state) => state.user.user);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviewsforProduct = async () => {
    try {
      const response = await axios.get(
        `${summaryAPI.common.getReviewsforProduct.url}/${productId}`,
        {
          withCredentials: true,
        }
      );
      setData(response.data.reviews);
    } catch (err) {
      setError("Error fetching product data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsforProduct();
  }, [productId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const response = await axios.post(
          summaryAPI.common.createReview.url,
          {
            productId,
            userId: user.id,
            rating: newReview.rating,
            review: newReview.review,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Review submitted successfully!");
          onSubmitReview(response.data.review);
          setData(response.data.success);
          setNewReview({ rating: 5, review: "" });
        } else {
          toast.error("Failed to submit review. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while submitting the review"
        );
      }
    } else {
      toast.error("Please login to submit a review");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };
  if (loading) {
    return <Preloader />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center text-xl">
          {error || "No product data found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 border-2 border-gray-200"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
          Write a Review
        </h3>

        {/* Rating */}
        <div className="mb-6">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Rating
          </label>
          <div className="relative">
            <select
              id="rating"
              name="rating"
              value={newReview.rating}
              onChange={handleChange}
              className="block w-full appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} ★
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="mb-6">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Review
          </label>
          <textarea
            id="review"
            name="review"
            rows="5"
            value={newReview.review}
            onChange={handleChange}
            className="block w-full appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 sm:text-sm"
            placeholder="Write your review here..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          Submit Review
        </button>
      </form>

      {data.map((review) => (
        <div
          key={review._id}
          className="bg-white mt-4 shadow-md rounded-lg p-6 mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <img
                className="w-10 h-10 rounded-full"
                src={review.user.profilePic}
                alt={review.user.email}
              />
              <p className="text-sm text-gray-600">{review.user.email}</p>
            </div>
            <p className="text-sm text-gray-600">{formatDate(review.date)}</p>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-sm bg-green-500 text-white px-1.5 py-0.5 rounded">
              {review.rating} ★
            </span>
          </div>
          <p className="text-gray-800">{review.review}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewComponent;
