import { useState } from "react";

import { PageNotFound } from "components/commons";
import Product from "components/Product";
import ProductList from "components/ProductList";
import {
  Redirect,
  Route,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";

import "./App.css";
import CartItemsContest from "./contexts/CartItemsContext";

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartItemsContest.Provider value={[cartItems, setCartItems]}>
      <Switch>
        <Route exact component={ProductList} path={routes.products.index} />
        <Route exact component={Product} path={routes.products.show} />
        <Redirect exact from={routes.root} to={routes.products.index} />
        <Route component={PageNotFound} path="*" />
      </Switch>
    </CartItemsContest.Provider>
  );
};

export default App;
