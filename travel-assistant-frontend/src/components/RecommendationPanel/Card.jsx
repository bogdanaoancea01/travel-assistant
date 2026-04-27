export default function Card({ image, title, subtitle }) {
  return (
    <div className="shrink-0 w-55 relative rounded-xl overflow-hidden cursor-pointer">
      <img
        className="w-full h-40 object-cover group-hover:scale-105 duration-300"
        src={image}
        alt={title}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <p className="text-sm font-medium leading-tight mb-0.5">{title}</p>
        <p className="text-xs text-white/90">{subtitle}</p>
      </div>
    </div>
  );
}
