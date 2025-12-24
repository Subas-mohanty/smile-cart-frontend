import { useState } from "react";

import { Header, PageLoader } from "components/commons/";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useDebounce from "hooks/useDebounce";
import useFuncDebounce from "hooks/useFuncDebounce";
import useQueryParams from "hooks/useQueryParams";
import { filterNonNull } from "neetocist";
import { Search } from "neetoicons";
import { Input, NoData, Pagination } from "neetoui";
import { isEmpty, mergeLeft } from "ramda";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildUrl } from "utils/url";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "./constants";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const { t } = useTranslation();
  const history = useHistory();

  // const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const queryParams = useQueryParams();
  const { page, pageSize, searchTerm = "" } = queryParams;
  const [searchKey, setSearchKey] = useState(searchTerm);

  const debouncedSearchKey = useDebounce(searchKey);

  // Notice we are not calling the function or passing the page parameter to the handlePageNavigation function inside the pagination component, then how it is being used here
  // the reason is Pagination component internally calls the handlePageNavigation function with the current page when the current page changes
  const handlePageNavigation = page =>
    history.replace(
      buildUrl(
        routes.products.index,
        mergeLeft({ page, pageSize: DEFAULT_PAGE_SIZE }, queryParams)
      )
    );

  const updateQueryParams = useFuncDebounce(value => {
    const params = {
      page: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      searchTerm: value || null,
    };

    history.replace(buildUrl(routes.products.index, filterNonNull(params)));
  });

  const productsParams = {
    searchTerm: debouncedSearchKey,
    page: Number(page),
    pageSize: Number(pageSize),
  };

  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts(productsParams);

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
              value={searchKey}
              onChange={({ target: { value } }) => {
                updateQueryParams(value);
                setSearchKey(value);
              }}
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
      <div className="self-end pb-3">
        <Pagination
          count={totalProductsCount}
          navigate={handlePageNavigation}
          pageNo={Number(page) || DEFAULT_PAGE_INDEX}
          pageSize={Number(pageSize)}
        />
      </div>
    </div>
  );
};

export default ProductList;
