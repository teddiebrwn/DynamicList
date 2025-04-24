import { useEffect, useState } from "react";

export function useTypewriterPlaceholders(
  placeholders: string[],
  speed = 40,
  pause = 1200
): string {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (typed.length < placeholders[index].length) {
      timeout = setTimeout(() => {
        setTyped(placeholders[index].slice(0, typed.length + 1));
      }, speed);
    } else {
      timeout = setTimeout(() => {
        setTyped("");
        setIndex((i) => (i + 1) % placeholders.length);
      }, pause);
    }
    return () => clearTimeout(timeout);
  }, [typed, index, placeholders, speed, pause]);
  return typed;
}
