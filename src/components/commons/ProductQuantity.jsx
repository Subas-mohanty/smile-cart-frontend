import React, { useRef } from "react";

import { VALID_COUNT_REGEX } from "components/constants/constants";
import useSelectedQuantity from "components/hooks/useSelectedQuantity";
import { Button, Input, Toastr } from "neetoui";

import TooltipWrapper from "./TooltipWrapper";

const ProductQuantity = ({ slug, availableQuantity }) => {
  //   const [selectedQuantity, setSelectedQuantity] = useCartItemsStore(
  //     paths([["cartItems", slug], ["setSelectedQuantity"]]),
  //     shallow
  //   );

  const countInputRef = useRef();

  const { selectedQuantity, setSelectedQuantity: updateSelectedQuantity } =
    useSelectedQuantity(slug);

  const parsedQuantity = parseInt(selectedQuantity) || 0;

  const isNotValidQuantity = parsedQuantity >= availableQuantity;

  const preventNavigation = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetCount = e => {
    const { value } = e.target;
    const isNotValidInputQuantity = parseInt(value) > availableQuantity;

    if (isNotValidInputQuantity) {
      Toastr.error(`Only ${availableQuantity} units are available`, {
        autoClose: 2000,
      });
      updateSelectedQuantity(availableQuantity);
      countInputRef.current.blur();
    } else if (VALID_COUNT_REGEX.test(value)) {
      updateSelectedQuantity(value);
    }
  };

  return (
    <div className="inline-flex items-center rounded-md border border-black">
      <Button
        className="focus-within:ring-0"
        label="-"
        style="text"
        onClick={e => {
          preventNavigation(e);
          updateSelectedQuantity(parsedQuantity - 1);
        }}
      />
      <Input
        nakedInput
        className="ml-2"
        contentSize="2"
        ref={countInputRef}
        value={selectedQuantity}
        onChange={handleSetCount}
        onClick={preventNavigation}
      />
      <TooltipWrapper
        content="Reached maximum units"
        position="top"
        showTooltip={isNotValidQuantity}
      >
        <Button
          className="focus-within:ring-0"
          disabled={isNotValidQuantity}
          label="+"
          style="text"
          onClick={e => {
            preventNavigation(e);
            updateSelectedQuantity(parsedQuantity + 1);
          }}
        />
      </TooltipWrapper>
    </div>
  );
};

export default ProductQuantity;
