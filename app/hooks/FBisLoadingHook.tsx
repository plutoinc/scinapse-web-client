import * as React from 'react';
declare var FB: any;

export default function useFBIsLoading() {
  const [FBisLoading, setFBisLoading] = React.useState(typeof FB === 'undefined');

  React.useEffect(
    () => {
      if (typeof FB !== 'undefined') {
        setFBisLoading(false);
      }
    },
    [typeof FB]
  );

  return FBisLoading;
}
