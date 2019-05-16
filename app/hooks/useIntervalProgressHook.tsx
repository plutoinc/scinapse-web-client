import * as React from "react";

export function useIntervalProgress(callback: () => void, delay: number | null) {
  const savedCallback = React.useRef(() => {});

  React.useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback]
  );

  React.useEffect(
    () => {
      function tick() {
        savedCallback.current();
      }

      if (delay !== null) {
        const timer = setInterval(tick, delay);
        return () => clearInterval(timer);
      }
    },
    [delay]
  );
}
