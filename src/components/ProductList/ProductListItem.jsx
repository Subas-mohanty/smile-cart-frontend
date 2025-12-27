import { memo } from "react";

import { AddToCart } from "components/commons";
import { Typography } from "neetoui";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildUrl } from "utils/url";
import withTitle from "utils/withTitle";

const ProductListItem = ({ imageUrl, name, offerPrice, slug }) => (
  <Link
    className="neeto-ui-border-black neeto-ui-rounded-xl flex w-48 flex-col items-center justify-between border p-4"
    to={buildUrl(routes.products.show, { slug })}
  >
    <img alt={name} className="h-40 w-40" src={imageUrl} />
    <Typography className="text-center" weight="semibold">
      {name}
    </Typography>
    <Typography>${offerPrice}</Typography>
    <AddToCart {...{ slug }} />
  </Link>
);

// export default withTitle(ProductListItem);
export default withTitle(memo(ProductListItem)); // memoizing the component, so that it will not re-render if the props have not changed, if only the parent component changed it will not run
