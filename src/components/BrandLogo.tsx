type Props = {
  name?: string;
  className?: string;
};

export function BrandLogo({ name = "Сладкая лавка", className = "" }: Props) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-label={name}>
      <img src="/images/logo.svg" alt="" width={46} height={46} />
    </span>
  );
}
