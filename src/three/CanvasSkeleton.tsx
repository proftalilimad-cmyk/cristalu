/**
 * Ossature affichée le temps du chargement du moteur 3D (chunk `three`).
 * Volontairement sobre : un cadre aluminium avec un balayage lumineux.
 */
export function CanvasHostSkeleton({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="relative h-[62%] w-[68%] max-w-lg">
        <div className="absolute inset-0 rounded-[1.5rem] border border-white/12" />
        <div className="absolute inset-[6%] rounded-xl border border-white/8 bg-gradient-to-br from-white/6 via-transparent to-glacier-400/10" />
        <div className="absolute inset-0 overflow-hidden rounded-[1.5rem]">
          <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        </div>
        <span className="absolute inset-x-0 -bottom-8 text-center text-[0.66rem] uppercase tracking-[0.3em] text-alu-500">
          {label ?? 'Initialisation 3D'}
        </span>
      </div>
    </div>
  )
}
