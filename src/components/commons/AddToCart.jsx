import { useContext } from "react";

import { Button } from "neetoui";
import { without } from "ramda";
import CartItemsContest from "src/contexts/CartItemsContext";

const AddToCart = ({ slug }) => {
  const [cartItems, setCartItems] = useContext(CartItemsContest);
  const isInCart = cartItems.includes(slug);

  // : cartItems.push(slug) --> can we use this instead of [slug, ...cartItems] ?
  // The answer is yes we can but, there are some issues with it, i.e,
  // Mutates the original array
  // Returns the new length of the array, NOT the array itself
  // ❌ Not safe in React state updates
  const toggleIsInCart = () => {
    setCartItems(prevItems =>
      prevItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems]
    );
  };

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleIsInCart();
  };

  return (
    <Button
      label={isInCart ? "Remove from cart" : "Add to cart"}
      size="large"
      onClick={e => handleClick(e)}
    />
  );
};

export default AddToCart;
