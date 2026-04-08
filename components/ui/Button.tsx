// Button.tsx
// a custom button component used for all buttons.
//
// notes.
// This button code creates buttons with a dark gray background,
// and a slightly lighter gray background when hovered.  It has
// white text.
//

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({ children, onClick, variant = "primary", }: ButtonProps) {

  // base styling + slight variations.
  const base = "px-3 py-1 rounded text-sm transition-colors";
  const variants = {
    primary: "bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-blue-200",
    secondary: "bg-slate-800 text-slate-300 hover:bg-slate-500 hover:text-white",
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
