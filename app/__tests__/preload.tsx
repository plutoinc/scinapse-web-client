window.alert = msg => {
  console.log(msg);
};
(window as any).matchMedia = () => ({});
window.scrollTo = () => {};

const localStorageMock = (function() {
  let store: any = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: any) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
