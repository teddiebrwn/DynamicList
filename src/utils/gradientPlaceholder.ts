export function getGradientPlaceholderStyle(): React.CSSProperties {
  return {
    background: "linear-gradient(90deg, #a3a3a3 25%, #fff 50%, #a3a3a3 75%)",
    backgroundSize: "200% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shimmer 2.5s linear infinite",
  };
}
