"use client";

type StartSurveyButtonProps = {
  onStart: () => void;
};

export default function StartSurveyButton({ onStart }: StartSurveyButtonProps) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="cursor-pointer border border-fg-primary bg-accent-secondary px-8 py-[14px] font-sans text-body uppercase leading-normal text-bg-elevated transition-opacity duration-150 ease-out hover:opacity-90"
    >
      Inizia sondaggio
    </button>
  );
}
