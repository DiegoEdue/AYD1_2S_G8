export default function FormField({
    label,
    name,
    error,
    ayuda,
    required,
    children,
    }) {
    return (
        <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-medium text-charcoal">
            {label}
            {required && <span className="ml-0.5 text-crimson">*</span>}
        </label>
        {children}
        {ayuda && !error && <p className="text-xs text-charcoal-light">{ayuda}</p>}
        {error && (
            <p role="alert" className="text-xs font-medium text-crimson">
            {error}
            </p>
        )}
        </div>
    );
    }

    export function inputClass(hasError) {
    return `w-full rounded-lg border px-3 py-2 text-sm text-charcoal outline-none transition focus:border-crimson focus:ring-2 focus:ring-crimson/20 ${
        hasError ? "border-crimson" : "border-charcoal/20"
    }`;
}
