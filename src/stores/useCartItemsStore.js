import { isNotEmpty } from "neetocist";
import { assoc, dissoc } from "ramda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// !revise this part
const useCartItemsStore = create(
  persist(
    set => ({
      cartItems: {},
      setSelectedQuantity: (slug, quantity) =>
        // set(state => {
        //   if (state.cartItems.includes(slug))
        //     return { cartItems: without([slug], state.cartItems) };
        //   return { cartItems: [slug, ...state.cartItems] }; // adding slug to cartItems array(basic JS spread operator)
        // }),
        set(({ cartItems }) => {
          if (quantity <= 0 && isNotEmpty(quantity)) {
            return { cartItems: dissoc(slug, cartItems) };
          }

          return { cartItems: assoc(slug, String(quantity), cartItems) };
        }),
    }),
    { name: "cart-items-store" }
  )
);

export default useCartItemsStore;
