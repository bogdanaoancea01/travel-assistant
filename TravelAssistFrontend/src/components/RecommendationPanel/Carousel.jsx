import { useEffect, useRef, useState } from "react";
import CarouselArrow from "./CarouselArrows";

export default function Carousel({ children }) {
  const containerRef = useRef(null);

  const [scrollState, setScrollState] = useState({
    left: false,
    right: true,
  });

  const updateScrollState = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setScrollState({
      left: scrollLeft > 0,
      right: scrollLeft + clientWidth < scrollWidth - 1,
    });
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  const scrollByCards = (direction) => {
    if (!containerRef.current) return;

    const CARD_WIDTH = 232;
    const offset = direction === "left" ? -CARD_WIDTH : CARD_WIDTH;

    containerRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      <CarouselArrow
        direction="left"
        visible={scrollState.left}
        onClick={() => scrollByCards("left")}
      />

      <CarouselArrow
        direction="right"
        visible={scrollState.right}
        onClick={() => scrollByCards("right")}
      />

      <div
        ref={containerRef}
        onScroll={() => updateScrollState(containerRef, setScrollState)}
        className="flex gap-4 overflow-hidden pb-4"
      >
        {children}
      </div>
    </div>
  );
}
