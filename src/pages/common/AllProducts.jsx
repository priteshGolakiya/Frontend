import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { useSelector } from "react-redux";
import Preloader from "../../component/Preloader";
import SkeletonLoader from "../../component/SkeletonLoader";
import summaryAPI from "../../utils/summaryAPI";
import MemoizedProductList from "./MemoizedProductList";

const PRODUCTS_PER_PAGE = 5;

const useInfiniteScroll = (callback) => {
  const observer = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    return () => observer.current?.disconnect();
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
  const token = useSelector((store) => store.user.token);

  const fetchProducts = useCallback(async () => {
    if (!hasMore || fetching) return;

    try {
      setFetching(true);
      const response = await axios.get(
        summaryAPI.common.getPaginatedProducts.url,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit: PRODUCTS_PER_PAGE },
        }
      );

      const { products: newProducts, totalPages, currentPage } = response.data;

      if (!Array.isArray(newProducts)) {
        throw new Error("Unexpected data format received from server.");
      }

      setProducts((prevProducts) => {
        const existingIds = new Set(prevProducts.map((p) => p._id));
        const uniqueNewProducts = newProducts.filter(
          (p) => !existingIds.has(p._id)
        );
        return [...prevProducts, ...uniqueNewProducts];
      });

      setHasMore(currentPage < totalPages);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [hasMore, fetching, page, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const lastProductRef = useInfiniteScroll(fetchProducts);

  const renderContent = () => {
    if (loading && products.length === 0) {
      return <Preloader />;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (products.length === 0 && !fetching) {
      return <div className="text-gray-500">No products found.</div>;
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      {renderContent()}
    </div>
  );
};

export default AllProducts;
