function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean,
}) {
  return (
    <button
  type="button"
  role="switch"
  aria-checked={checked}
  onClick={() => onChange(!checked)}
  className={`relative inline-flex h-8 w-14 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
    checked ? "bg-blue-500" : "bg-gray-300"
  }`}
  disabled={disabled}
>
  <span
    className={`inline-block h-6 w-6 sm:h-4 sm:w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
      checked ? "translate-x-7 sm:translate-x-6" : "translate-x-1"
    }`}
  />
</button>
  );
}

export default Toggle