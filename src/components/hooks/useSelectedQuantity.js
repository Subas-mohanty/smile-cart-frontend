import { paths } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";
import { shallow } from "zustand/shallow";

// const [selectedQuantity, setSelectedQuantity] = useCartItemsStore(
//     paths([["cartItems", slug], ["setSelectedQuantity"]]),
//     shallow
//   );
// the above line is equivalent to
// const selectedQuantity = state.cartItems[slug];
// const setSelectedQuantity = state.setSelectedQuantity;

const useSelectedQuantity = slug => {
  const [selectedQuantity, setSelectedQuantity] = useCartItemsStore(
    paths([["cartItems", slug], ["setSelectedQuantity"]]),
    shallow
  );

  const updateSelectedQuantity = quantity => {
    setSelectedQuantity(slug, quantity);
  };

  return { selectedQuantity, setSelectedQuantity: updateSelectedQuantity };
};

export default useSelectedQuantity;
