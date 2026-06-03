import { Fragment } from "react";
import type { Signature as SignatureType, SignaturePiece } from "@/lib/schemas";
import { Localized } from "./Localized";

function PieceCard({ piece }: { piece: SignaturePiece }) {
  return (
    <div className="flex-1 break-avoid rounded-2xl border border-black/5 bg-white p-3 text-center shadow-sm">
      <div className="text-3xl" aria-hidden>
        {piece.icon}
      </div>
      <p className="mt-1 font-bold text-ink">
        <Localized value={piece.label} />
      </p>
      <p className="text-xs leading-snug text-ink/55">
        <Localized value={piece.detail} />
      </p>
    </div>
  );
}

export function Signature({ data }: { data: SignatureType }) {
  return (
    <div>
      <p className="mb-5 leading-relaxed text-ink/70">
        <Localized value={data.thesis} />
      </p>

      {/* The three pieces, joined as a formula */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {data.pieces.map((p, i) => (
          <Fragment key={i}>
            <PieceCard piece={p} />
            {i < data.pieces.length - 1 && (
              <span
                className="self-center px-1 text-xl font-bold text-ink/30"
                aria-hidden
              >
                +
              </span>
            )}
          </Fragment>
        ))}
      </div>

      <div className="my-2 text-center text-2xl text-brand" aria-hidden>
        ↓
      </div>

      {/* The convergence: a rare, high-potential direction */}
      <div className="break-avoid flex items-center gap-4 rounded-3xl border-2 border-brand/20 bg-brand/8 p-5">
        <span className="text-4xl" aria-hidden>
          {data.outcome.icon}
        </span>
        <div>
          <p className="font-display text-xl font-extrabold text-brand">
            <Localized value={data.outcome.label} />
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-ink/70">
            <Localized value={data.outcome.detail} />
          </p>
        </div>
      </div>
    </div>
  );
}
