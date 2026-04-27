import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselArrow({ direction, onClick, visible = true }) {
  if (!visible) return null;

  return (
    <div className="">
      <button
        onClick={onClick}
        className={`
        absolute top-1/2 -translate-y-1/2
        ${direction === "left" ? "left-0" : "right-0"}
        bg-white shadow-md rounded-full p-2
        opacity-0 group-hover:opacity-100
        transition
      `}
      >
        {direction === "left" ? "<" : ">"}
      </button>
    </div>
  );
}
