export const BUBBLE_CONTEXT_TYPE = 'b_c_t';

const store = require('store');

export function setBubbleContextTypeHelper() {
  const bubbleContextType: number = store.get(BUBBLE_CONTEXT_TYPE) || 1;

  if (bubbleContextType < 3) {
    store.set(BUBBLE_CONTEXT_TYPE, bubbleContextType + 1);
  } else {
    store.set(BUBBLE_CONTEXT_TYPE, 1);
  }
}
