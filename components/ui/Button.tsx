// Button.tsx
// a custom button component.  TypeScript file with JSX support.
//
// notes.
// This button code creates buttons with a dark gray background,
// and a slightly lighter gray background when hovered.  It has
// white text.  The "primary" style is a little more prominent
// than the "secondary" style.

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({ children, onClick, variant = "primary", }: ButtonProps) {
  const base = "px-3 py-1 rounded text-sm transition-colors";

  const variants = {
    primary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
    secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
