declare var trackJs: any;

const trackJsLogger = (store: any) => (next: any) => (action: any) => {
  try {
    console.log(action);
    return next(action);
  } catch (err) {
    console.warn(store.getState());
    if (trackJs) {
      trackJs.track(err);
    }
  }
};

export default trackJsLogger;
