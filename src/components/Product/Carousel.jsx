import { useEffect, useRef, useState } from "react";

import classNames from "classnames";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { Left, Right } from "neetoicons";
import { Button } from "neetoui";
import { append } from "ramda";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const Carousel = () => {
  const { slug } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const { data: { imageUrl, imageUrls: partialImageUrls, title } = {} } =
    useShowProduct(slug);

  const imageUrls = append(imageUrl, partialImageUrls);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(handleNext, 3000);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
  };

  const handlePrevious = () => {
    // why we don't call the resetTimer function inside handleNext instead of calling it separately on right click ?
    // The reason is that handleNext is also used in the useEffect for automatic image scrolling. If we call the resetTimer inside handleNext, it will reset the timer every time the timer is executed.

    resetTimer();
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  useEffect(() => {
    timerRef.current = setInterval(handleNext, 3000);

    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <Button
          className="shrink-0 focus-within:ring-0 hover:bg-transparent"
          icon={Left}
          style="text"
          onClick={handlePrevious}
        />
        <img
          alt={title}
          className="max-w-56 h-56 max-h-56 w-56"
          src={imageUrls[currentIndex]}
        />
        <Button
          className="shrink-0 focus-within:ring-0 hover:bg-transparent"
          icon={Right}
          style="text"
          onClick={() => {
            handleNext();
            resetTimer();
          }}
        />
      </div>
      <div className="mt-2 flex space-x-1">
        {imageUrls.map((_, index) => {
          // const defaultClasses =
          //   "neeto-ui-border-black neeto-ui-rounded-full h-3 w-3 cursor-pointer border";
          // const dotClasses =
          //   index === currentIndex
          //     ? defaultClasses.concat(" neeto-ui-bg-black")
          //     : defaultClasses;
          // using the classNames package, we replicate the above conditional class rendering

          const classes = classNames(
            "neeto-ui-border-black neeto-ui-rounded-full h-3 w-3 cursor-pointer border",
            {
              " neeto-ui-bg-black": index === currentIndex,
            }
          );

          return (
            <span
              className={classes}
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetTimer();
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
