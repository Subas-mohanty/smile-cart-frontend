import React, { useRef, useState } from "react";

import { VALID_COUNT_REGEX } from "components/constants/constants";
import useSelectedQuantity from "components/hooks/useSelectedQuantity";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { Alert, Button, Input, Toastr } from "neetoui";
import { Trans, useTranslation } from "react-i18next";
import useCartItemsStore from "stores/useCartItemsStore";

import TooltipWrapper from "./TooltipWrapper";

const ProductQuantity = ({
  slug,
  shouldShowDeleteAlert = false,
  name = "",
}) => {
  const { t } = useTranslation();

  //   const [selectedQuantity, setSelectedQuantity] = useCartItemsStore(
  //     paths([["cartItems", slug], ["setSelectedQuantity"]]),
  //     shallow
  //   );

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { data: product = {} } = useShowProduct(slug);

  const { availableQuantity } = product;

  const countInputRef = useRef();

  const { selectedQuantity, setSelectedQuantity: updateSelectedQuantity } =
    useSelectedQuantity(slug);

  const parsedQuantity = parseInt(selectedQuantity) || 0;

  const isNotValidQuantity = parsedQuantity >= availableQuantity;
  const removeCartItem = useCartItemsStore.pickFrom();

  const preventNavigation = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetCount = e => {
    const { value } = e.target;
    const isNotValidInputQuantity = parseInt(value) > availableQuantity;

    if (isNotValidInputQuantity) {
      const errorMessage = t("error.quantityLimit", {
        count: availableQuantity,
      });
      Toastr.error(errorMessage, { autoClose: 2000 });
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
          if (shouldShowDeleteAlert && parsedQuantity === 1) {
            setShowDeleteAlert(true);

            return;
          }

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
        content={t("reachedMaximumUnits")}
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
      <Alert
        isOpen={showDeleteAlert}
        submitButtonLabel={t("removeItemConfirmation.button")}
        title={t("removeItemConfirmation.title")}
        message={
          <Trans i18nKey="removeItemConfirmation.message" values={{ name }} />
        }
        onClose={() => setShowDeleteAlert(false)}
        onSubmit={() => {
          removeCartItem(slug);
          setShowDeleteAlert(false);
        }}
      />
    </div>
  );
};

export default ProductQuantity;
