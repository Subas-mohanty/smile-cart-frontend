import { without } from "ramda";
import { create } from "zustand";

// !revise this part
const useCartItemsStore = create(set => ({
  cartItems: [],
  toggleIsInCart: slug =>
    // set(state => {
    //   if (state.cartItems.includes(slug))
    //     return { cartItems: without([slug], state.cartItems) };
    //   return { cartItems: [slug, ...state.cartItems] }; // adding slug to cartItems array(basic JS spread operator)
    // }),
    set(({ cartItems }) => ({
      cartItems: cartItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems],
    })),
}));

export default useCartItemsStore;
