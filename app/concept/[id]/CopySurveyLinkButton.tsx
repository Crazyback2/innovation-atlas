import Link from "next/link";

const secondaryActionButtonClassName =
  "inline-flex w-[200px] shrink-0 items-center justify-center border border-fg-primary bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-90";

const primaryActionButtonClassName =
  "inline-flex w-[200px] shrink-0 items-center justify-center border-none bg-accent-primary px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-90";

export default function CopySurveyLinkButton({
  publicToken,
  primary = false,
}: {
  publicToken: string;
  /** Bottone lime quando la riga Survey SP è il passo attivo. */
  primary?: boolean;
}) {
  return (
    <Link
      href={`/sp/${publicToken}`}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary ? primaryActionButtonClassName : secondaryActionButtonClassName
      }
    >
      Apri link pubblico
    </Link>
  );
}
