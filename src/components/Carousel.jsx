import { useState } from "react";

import classNames from "classnames";
import { Left, Right } from "neetoicons";
import { Button } from "neetoui";

const Carousel = ({ imageUrls, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % imageUrls.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + imageUrls.Length) % imageUrls.length;
    setCurrentIndex(prevIndex);
  };

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
          onClick={handleNext}
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
              onClick={() => setCurrentIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
