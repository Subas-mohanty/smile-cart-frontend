import useSelectedQuantity from "components/hooks/useSelectedQuantity";
import { Button } from "neetoui";
import { isNil } from "ramda";
import { useTranslation } from "react-i18next";

import ProductQuantity from "./ProductQuantity";

const AddToCart = ({ slug, availableQuantity }) => {
  const { t } = useTranslation();

  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);

  // : cartItems.push(slug) --> can we use this instead of [slug, ...cartItems] ?
  // The answer is yes we can but, there are some issues with it, i.e,
  // Mutates the original array
  // Returns the new length of the array, NOT the array itself
  // ❌ Not safe in React state updates
  // const toggleIsInCart = () => {
  //   setCartItems(prevItems =>
  //     prevItems.includes(slug)
  //       ? without([slug], cartItems)
  //       : [slug, ...cartItems]
  //   );
  // };

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQuantity(1);
  };

  if (isNil(selectedQuantity)) {
    return <Button label={t("addToCart")} size="large" onClick={handleClick} />;
  }

  return <ProductQuantity {...{ slug, availableQuantity }} />;
};

export default AddToCart;
