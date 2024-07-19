import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import Preloader from "../../component/Preloader";
import summaryAPI from "../../utils/summaryAPI";
import MemoizedProductList from "./MemoizedProductList";
import SkeletonLoader from "../../component/SkeletonLoader";

const useInfiniteScroll = (callback) => {
  const observer = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    return () => observer.current.disconnect();
  }, [callback]);

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    if (node) observer.current.observe(node);
  }, []);

  return lastElementRef;
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      const response = await axios.get(summaryAPI.common.getAllProducts.url, {
        params: { page: page, limit: 50 },
      });

      const newProducts = response.data || [];
      if (!Array.isArray(newProducts)) {
        console.error("Received non-array products:", newProducts);
        setError("Unexpected data format received from server.");
        return;
      }
      setProducts(newProducts);
      setHasMore(newProducts.length > 0);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [page]);

  const lastProductRef = useInfiniteScroll(() => {
    if (!fetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (products.length === 0 && !fetching) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-gray-500">No products found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <MemoizedProductList
        products={products}
        lastProductRef={lastProductRef}
      />
      {fetching && (
        <div className="text-center py-4">
          <SkeletonLoader />
        </div>
      )}
      {!hasMore && (
        <p className="text-center mt-4">No more products to load.</p>
      )}
    </div>
  );
};

export default AllProducts;
