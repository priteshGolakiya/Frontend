import { useState, useEffect } from "react";
import axios from "axios";
import summaryAPI from "../../../../utils/summaryAPI";
import moment from "moment";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(summaryAPI.admin.getAllReviews.url, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        console.error("AxiosError:", error.toJSON());
        // Show an error message to the user
      }
    };

    fetchReviews();
  }, []); // Add dependencies if needed

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Reviews</h1>
      {reviews.map((review, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{review.product?.name}</h3>
            <span className="text-gray-500 text-sm">
              {moment(review.date).format("LLL")}
            </span>
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-500">Rating:</span>
            <span className="text-yellow-500">{review.rating}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-500">User:</span>
            <span>{review.user?.email}</span>
          </div>

          <p className="text-gray-700">{review?.review}</p>
        </div>
      ))}
    </div>
  );
};

export default Review;
