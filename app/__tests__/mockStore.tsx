import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

export const generateMockStore = (state: any) => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(state);
  store.clearActions();
  return store;
};
