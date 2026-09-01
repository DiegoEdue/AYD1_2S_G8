export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3">
            <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-sage-light border-t-crimson"
            role="status"
            aria-label="Cargando"
            />
            <p className="font-body text-sm text-charcoal-light">Cargando EduConnect…</p>
        </div>
        </div>
    );
}
