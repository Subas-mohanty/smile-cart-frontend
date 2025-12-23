import { useEffect, useState } from "react";

import productsApi from "apis/product";
import { Header, PageLoader } from "components/commons/";
import useDebounce from "hooks/useDebounce";
import { Search } from "neetoicons";
import { Input, NoData } from "neetoui";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const debouncedValue = useDebounce(searchValue);

  const fetchProducts = async () => {
    try {
      const { products } = await productsApi.fetch({
        searchTerm: debouncedValue,
      });
      setProducts(products);
    } catch (error) {
      console.log(t("error.genericError", { error }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedValue]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-col">
        <Header
          shouldShowBackButton={false}
          title={t("title")}
          actionBlock={
            <Input
              placeholder={t("searchProducts")}
              prefix={<Search />}
              type="search"
              value={searchValue}
              onChange={event => setSearchValue(event.target.value)}
            />
          }
        />
        {isEmpty(products) ? (
          <NoData className="h-screen w-full" title={t("noData")} />
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
