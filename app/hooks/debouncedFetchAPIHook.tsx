import * as React from "react";
import { UseDebouncedAsyncFetchParams, dataFetchReducer, ReducerState, ReducerAction } from "./types";

export function useDebouncedAsyncFetch<P, T>({
  initialParams,
  fetchFunc,
  validateFunc,
  wait,
}: UseDebouncedAsyncFetchParams<P, T>) {
  const [params, setParams] = React.useState(initialParams);
  const [state, dispatch] = React.useReducer(dataFetchReducer as React.Reducer<ReducerState<T>, ReducerAction<T>>, {
    isLoading: false,
    errorMsg: "",
    data: null,
  });

  React.useEffect(
    () => {
      if (validateFunc) {
        try {
          validateFunc(params);
        } catch (err) {
          return dispatch({ type: "FETCH_FAILURE" });
        }
      }

      const timeout = setTimeout(() => {
        async function lazyFetch() {
          dispatch({ type: "FETCH_INIT" });
          try {
            const res = await fetchFunc(params);
            dispatch({ type: "FETCH_SUCCESS", payload: { data: res } });
          } catch (err) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }

        lazyFetch();
      }, wait);

      return () => {
        clearTimeout(timeout);
      };
    },
    [params]
  );

  return { ...state, setParams };
}
