export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-ink/60">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
