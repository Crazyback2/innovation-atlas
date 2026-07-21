"use client";

type StartSurveyButtonProps = {
  targetId: string;
};

export default function StartSurveyButton({ targetId }: StartSurveyButtonProps) {
  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-pointer border border-fg-primary bg-accent-secondary px-8 py-[14px] font-sans text-body uppercase leading-normal text-bg-elevated transition-opacity duration-150 ease-out hover:opacity-90"
    >
      Inizia sondaggio
    </button>
  );
}
