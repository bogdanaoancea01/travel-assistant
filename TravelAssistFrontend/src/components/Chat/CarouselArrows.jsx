import { ChevronLeft, ChevronRight } from "lucide-react";

export function CarouselArrow({ direction, onClick, visible = true }) {
  if (!visible) return null;

  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const position = direction === "left" ? "left-2" : "right-2";

  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={`
        absolute ${position} top-1/2 -translate-y-1/2
        z-20
        flex items-center justify-center
        h-8 w-8
        rounded-full bg-white shadow-md
        text-gray-700
        transition-opacity duration-200
        opacity-0 group-hover:opacity-100
        hover:bg-gray-100
        cursor-pointer
      `}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
