// Checkbox.tsx
// a custom checkbox component used for all checkboxes.
//
// notes.
// This checkbox code creates checkboxes with a dark gray background,
// with white text.  When hovered, a slightly lighter gray
// background when hovered, with light blue text.
//


type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  variant?: "primary" | "secondary";
};

export default function Checkbox({
  label,
  checked,
  onChange,
  variant = "primary",
}: CheckboxProps) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors cursor-pointer select-none";

  const variants = {
    primary:
      "bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-blue-200",
    secondary:
      "bg-slate-800 text-slate-300 hover:bg-slate-500 hover:text-white",
  };

  return (
    <label className={`${base} ${variants[variant]}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-blue-400"
      />
      <span>{label}</span>
    </label>
  );
}
