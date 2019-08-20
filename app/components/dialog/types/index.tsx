import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { DialogState } from '../reducer';
import { CurrentUser } from '../../../model/currentUser';
import { Collection } from '../../../model/collection';
import { LayoutState } from '../../layouts/reducer';

export interface DialogContainerProps
  extends Readonly<{
      layout: LayoutState;
      dialogState: DialogState;
      myCollections: Collection[];
      currentUser: CurrentUser;
      dispatch: Dispatch<any>;
    }>,
    RouteComponentProps<null> {}
