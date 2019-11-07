import React from 'react';
import ActionTicketManager from '../helpers/actionTicketManager';
import { ActionTicketParams } from '../helpers/actionTicketManager/actionTicket';

export function useObserver(threshold: number | number[] | undefined, ticketParams: ActionTicketParams) {
  const elRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => {
      const intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              ActionTicketManager.trackTicket(ticketParams);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold }
      );

      if (elRef.current) {
        intersectionObserver.observe(elRef.current);
      }

      return () => intersectionObserver.disconnect();
    },
    [ticketParams, threshold]
  );
  return { elRef };
}
