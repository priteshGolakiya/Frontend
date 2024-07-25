// /* eslint-disable react/prop-types */
// const Filters = ({
//   sortOrder,
//   setSortOrder,
//   priceRange,
//   setPriceRange,
//   ratingFilter,
//   setRatingFilter,
//   discountFilter,
//   setDiscountFilter,
//   clearFilter,
// }) => {
//   return (
//     <div>
//       <h3 className="font-semibold mb-2">Sort by Price</h3>
//       <button
//         className="bg-cyan-400 p-1 mb-2 w-full rounded-md text-white font-bold hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         onClick={clearFilter}
//       >
//         Clear Filter
//       </button>

//       <select
//         value={sortOrder}
//         onChange={(e) => setSortOrder(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       >
//         <option value="">Select</option>
//         <option value="lowToHigh">Low to High</option>
//         <option value="highToLow">High to Low</option>
//       </select>

//       <h3 className="font-semibold mb-2">Price Range</h3>
//       <input
//         type="text"
//         placeholder="Min"
//         value={priceRange.min}
//         onChange={(e) => {
//           const value = parseInt(e.target.value);
//           setPriceRange({ ...priceRange, min: isNaN(value) ? "" : value });
//         }}
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <input
//         type="text"
//         placeholder="Max"
//         value={priceRange.max}
//         onChange={(e) => {
//           const value = parseInt(e.target.value);
//           setPriceRange({ ...priceRange, max: isNaN(value) ? "" : value });
//         }}
//         className="w-full p-2 mb-4 border rounded"
//       />

//       <h3 className="font-semibold mb-2">Minimum Rating</h3>
//       <select
//         value={ratingFilter}
//         onChange={(e) => setRatingFilter(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       >
//         <option value="">All</option>
//         <option value="4">4★ & above</option>
//         <option value="3">3★ & above</option>
//         <option value="2">2★ & above</option>
//         <option value="1">1★ & above</option>
//       </select>

//       <h3 className="font-semibold mb-2">Minimum Discount</h3>
//       <select
//         value={discountFilter}
//         onChange={(e) => setDiscountFilter(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       >
//         <option value="">All</option>
//         <option value="10">10% & above</option>
//         <option value="20">20% & above</option>
//         <option value="30">30% & above</option>
//         <option value="40">40% & above</option>
//         <option value="50">50% & above</option>
//       </select>
//     </div>
//   );
// };
// export default Filters;

/* eslint-disable react/prop-types */
const Filters = ({
  sortOrder,
  setSortOrder,
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
  discountFilter,
  setDiscountFilter,
  clearFilter,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>
      <button
        className="bg-cyan-400 p-2 mb-4 w-full rounded-md text-white font-bold hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
        onClick={clearFilter}
      >
        Clear All Filters
      </button>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Sort by Price</h4>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          >
            <option value="">Select</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Price Range</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setPriceRange({
                  ...priceRange,
                  min: isNaN(value) ? "" : value,
                });
              }}
              className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setPriceRange({
                  ...priceRange,
                  max: isNaN(value) ? "" : value,
                });
              }}
              className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Minimum Rating</h4>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
            <option value="1">1★ & above</option>
          </select>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Minimum Discount</h4>
          <select
            value={discountFilter}
            onChange={(e) => setDiscountFilter(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="10">10% & above</option>
            <option value="20">20% & above</option>
            <option value="30">30% & above</option>
            <option value="40">40% & above</option>
            <option value="50">50% & above</option>
          </select>
        </div>
      </div>
    </div>
  );  
};

export default Filters;
