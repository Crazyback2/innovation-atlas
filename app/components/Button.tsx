import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

const baseClassName =
  "cursor-pointer font-sans text-body font-medium leading-normal px-6 py-3.5";

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "border-none bg-fg-primary text-bg-primary transition-opacity duration-150 ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "border border-accent-tertiary bg-transparent text-fg-primary transition-colors duration-150 ease-out hover:border-fg-primary disabled:cursor-not-allowed disabled:opacity-60",
};

export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[baseClassName, variantClassName[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
