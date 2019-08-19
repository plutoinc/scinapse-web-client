import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { LayoutState } from '../reducer';
import { CurrentUser } from '../../../model/currentUser';
import { MyCollectionsState } from '../../../containers/paperShowCollectionControlButton/reducer';
import { Paper } from '../../../model/paper';

export interface HeaderProps extends RouteComponentProps<any> {
  layoutState: LayoutState;
  currentUserState: CurrentUser;
  myCollectionsState: MyCollectionsState;
  paper: Paper | undefined;
  dispatch: Dispatch<any>;
}
