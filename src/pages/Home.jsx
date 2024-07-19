import BannerCarousel from "../component/common/BannerCarousel";
import ProductSlider from "../component/common/ProductSlider";
import AllProducts from "./common/AllProducts";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ProductSlider />
      </div>
      <div className="w-full md:w-full lg:w-full">
        <BannerCarousel />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <AllProducts />
      </div>
    </div>
  );
};

export default Home;
