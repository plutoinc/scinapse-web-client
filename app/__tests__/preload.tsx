window.alert = msg => {
  console.log(msg);
};
(window as any).matchMedia = () => ({});
window.scrollTo = () => {};
