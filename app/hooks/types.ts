export interface ReducerState<T> {
  isLoading: boolean;
  errorMsg: string;
  data: T | null;
}

export interface ReducerAction<T> {
  type: string;
  payload?: {
    data?: T;
    errorMsg?: string;
  };
}

export interface UseAsyncFetchParams<P, R> {
  initialParams: P;
  fetchFunc: (params: P) => Promise<R>;
  validateFunc?: (params: P) => void;
}

export interface UseDebouncedAsyncFetchParams<P, R> extends UseAsyncFetchParams<P, R> {
  wait: number;
}

export function dataFetchReducer<T>(state: ReducerState<T>, action: ReducerAction<T>) {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        errorMsg: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        errorMsg: "",
        data: action.payload && action.payload.data ? action.payload.data : state.data,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        errorMsg: action.payload && action.payload.errorMsg ? action.payload.errorMsg : "Something went wrong",
      };
    default:
      throw new Error();
  }
}
