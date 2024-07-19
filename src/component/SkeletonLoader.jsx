
const SkeletonLoader = () => {
  return (
    <div className="max-w-xs mx-auto p-4 bg-white shadow-md rounded-md animate-pulse">
      <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
      <div className="bg-gray-200 h-4 w-2/3 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
    </div>
  );
};

export default SkeletonLoader;
