import * as React from 'react';
import EnvChecker from '../helpers/envChecker';

export function useEnvHook() {
  const [isOnClient, setIsOnClient] = React.useState(false);
  React.useEffect(() => {
    setIsOnClient(!EnvChecker.isOnServer());
  }, []);

  return { isOnClient };
}
