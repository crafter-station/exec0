/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Vibe code> */
export default function DiagonalDivider() {
  return (
    <svg className="h-6 w-full stroke-border">
      <title>Divider</title>
      <defs>
        <pattern
          id="diagonal-footer-pattern"
          patternUnits="userSpaceOnUse"
          width="64"
          height="64"
        >
          {Array.from({ length: 17 }, (_, i) => (
            <path
              key={i}
              d={`M${-106 + i * 8} 110L${22 + i * 8} -18`}
              strokeWidth="1"
            />
          ))}
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#diagonal-footer-pattern)"
        stroke="none"
      />
    </svg>
  );
}
