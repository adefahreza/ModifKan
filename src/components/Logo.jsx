const SIZES = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" };

export default function Logo({ size = "md", className = "" }) {
  return (
    <span className={`font-display font-extrabold italic uppercase tracking-tight ${SIZES[size]} ${className}`}>
      <span className="text-white">Modif</span><span className="text-red-600">Kan</span>
    </span>
  );
}
