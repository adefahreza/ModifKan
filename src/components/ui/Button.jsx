const VARIANTS = {
  primary: "bg-red-600 text-white hover:bg-red-700",
  secondary: "bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const SIZES = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export default function Button({ variant = "primary", size = "md", as: Tag = "button", className = "", ...props }) {
  const extra = Tag === "button" && !props.type ? { type: "button" } : {};
  return (
    <Tag
      {...extra}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    />
  );
}
