import * as React from 'react';
import { UseAsyncFetchParams, dataFetchReducer, ReducerState, ReducerAction } from './types';

export function useAsyncFetch<P, T>({ initialParams, fetchFunc, validateFunc }: UseAsyncFetchParams<P, T>) {
  const [params, setParams] = React.useState(initialParams);
  const [state, dispatch] = React.useReducer(dataFetchReducer as React.Reducer<ReducerState<T>, ReducerAction<T>>, {
    isLoading: false,
    errorMsg: '',
    data: null,
  });

  React.useEffect(
    () => {
      let cancel = false;

      if (validateFunc) {
        try {
          validateFunc(params);
        } catch (err) {
          if (!cancel) {
            return dispatch({ type: 'FETCH_FAILURE' });
          }
        }
      }

      async function lazyFetch() {
        dispatch({ type: 'FETCH_INIT' });
        try {
          const res = await fetchFunc(params);
          if (!cancel) {
            dispatch({ type: 'FETCH_SUCCESS', payload: { data: res } });
          }
        } catch (err) {
          if (!cancel) {
            dispatch({ type: 'FETCH_FAILURE' });
          }
        }
      }

      lazyFetch();

      return () => {
        cancel = true;
      };
    },
    [params]
  );

  return { ...state, setParams };
}
