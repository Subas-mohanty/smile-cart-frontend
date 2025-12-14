import { useEffect, useState } from "react";

import productsApi from "apis/product";
import { PageNotFound, Header, PageLoader } from "components/commons";
import { Typography } from "neetoui";
import { append, isNotNil } from "ramda";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import Carousel from "./Carousel";

const Product = () => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { slug } = useParams(); // useParams returns an object {slug : <value of slug>}, slug is the value from the route /products/:slug, inside App.jsx

  const fetchProduct = async () => {
    try {
      const product = await productsApi.show(slug);
      setProduct(product);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // calling the fetchProduct function inside useEffect, so that the API call or the http request is made only once on the first render not on every render, this is why we have an empty dependency array in the useEffect

  // fetchProduct();

  // why calling the function inside useEffect instead of directly calling the function outside ?
  // we know that every time a state variable changes the component re-render. There may be many state variables inside a component And if we call the function outside, it will be called on every re-render when any of these state variable changes, we will be making unnecessary api calls in this way. But by calling it inside useEffect with an empty dependency array we are making sure that the api call is made only once(on the initial render not on subsequent renders)

  useEffect(() => {
    fetchProduct();
  }, []);

  const { name, imageUrl, imageUrls, description, mrp, offerPrice } = product;

  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);

  if (isError) return <PageNotFound />;

  if (isLoading) return <PageLoader />;

  return (
    <div className="px-6 pb-6">
      <div className="m-2">
        <Header title={name} />
      </div>
      <div className="mt-16 flex gap-4">
        <div className="w-2/5">
          <div className="flex justify-center gap-16">
            {isNotNil(imageUrls) ? (
              <Carousel imageUrls={append(imageUrl, imageUrls)} title={name} />
            ) : (
              <img alt={name} className="w-48" src={imageUrl} />
            )}
          </div>
        </div>
        <div className="w-3/5 space-y-4">
          <Typography>{description}</Typography>
          <Typography>MRP: {mrp}</Typography>
          <Typography className="font-semibold">
            Offer price: {offerPrice}
          </Typography>
          <Typography className="font-semibold text-green-600">
            {discountPercentage}% off
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Product;
