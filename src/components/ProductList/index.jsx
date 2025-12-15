import { useEffect, useState } from "react";

import productsApi from "apis/product";
import { Header, PageLoader } from "components/commons/";
import { Search } from "neetoicons";
import { Input, NoData } from "neetoui";
import { isEmpty } from "ramda";

import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const fetchProducts = async () => {
    try {
      const { products } = await productsApi.fetch({
        searchTerm: searchValue,
      });
      setProducts(products);
    } catch (error) {
      console.log("An error occurred: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchValue]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-col">
        <Header
          shouldShowBackButton={false}
          title="Smile cart"
          actionBlock={
            <Input
              placeholder="Search products"
              prefix={<Search />}
              type="search"
              value={searchValue}
              onChange={event => setSearchValue(event.target.value)}
            />
          }
        />
        {isEmpty(products) ? (
          <NoData className="h-full w-full" title="No products to show" />
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductListItem key={product.slug} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
