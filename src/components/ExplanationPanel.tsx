import { memo } from "react";

type Props = {
  explanation: string;
  correctIndex: number;
  /** Optional: show "Why X is correct" header when explanation lacks its own. */
  showWhyHeader?: boolean;
  className?: string;
};

/**
 * Always shows the full explanation (no truncation).
 * Preserves multi-paragraph AR layouts (Why / About A / About R / Linkage).
 */
function ExplanationPanelInner({
  explanation,
  correctIndex,
  showWhyHeader = true,
  className = "",
}: Props) {
  const letter = String.fromCharCode(65 + correctIndex);
  const hasOwnWhy = /why\s+[a-d]\s+is correct/i.test(explanation);
  const looksStructured =
    /about a:/i.test(explanation) ||
    /about r:/i.test(explanation) ||
    /statement 1:/i.test(explanation) ||
    /\n\n/.test(explanation);

  return (
    <div
      className={`rounded-lg bg-slate-50 p-3 text-sm text-slate-800 ${className}`.trim()}
    >
      {showWhyHeader && !hasOwnWhy ? (
        <p className="mb-1.5 font-semibold text-slate-900">
          Why {letter} is correct
        </p>
      ) : null}
      <div
        className={`whitespace-pre-wrap break-words leading-relaxed ${
          looksStructured ? "space-y-1" : ""
        }`}
      >
        {explanation}
      </div>
    </div>
  );
}

export const ExplanationPanel = memo(ExplanationPanelInner);
export default ExplanationPanel;
