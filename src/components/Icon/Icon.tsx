type Props = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: Props) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
