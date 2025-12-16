import { useEffect, useState } from "react";

import productsApi from "apis/product";
import { Header, PageLoader } from "components/commons/";
import useDebounce from "hooks/useDebounce";
import { Search } from "neetoicons";
import { Input, NoData } from "neetoui";
import { isEmpty, without } from "ramda";

import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const debouncedValue = useDebounce(searchValue);

  const fetchProducts = async () => {
    try {
      const { products } = await productsApi.fetch({
        searchTerm: debouncedValue,
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
  }, [debouncedValue]);

  // : cartItems.push(slug) --> can we use this instead of [slug, ...cartItems] ?
  // The answer is yes we can but, there are some issues with it, i.e,
  // Mutates the original array
  // Returns the new length of the array, NOT the array itself
  // ❌ Not safe in React state updates

  const toggleIsInCart = slug => {
    setCartItems(prevItems =>
      prevItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems]
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-col">
        <Header
          cartItemsCount={cartItems.length}
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
          <NoData className="h-screen w-full" title="No products to show" />
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductListItem
                key={product.slug}
                {...product}
                isInCart={cartItems.includes(product.slug)}
                toggleIsInCart={() => toggleIsInCart(product.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
