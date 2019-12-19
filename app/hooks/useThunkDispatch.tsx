import { useDispatch } from 'react-redux';
import StoreManager from '../store/store';

export const useThunkDispatch = () => {
  return useDispatch<typeof StoreManager.store.dispatch>();
};
