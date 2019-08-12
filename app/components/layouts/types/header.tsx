import { Dispatch } from 'redux';
import { LayoutState } from '../records';
import { CurrentUser } from '../../../model/currentUser';
import { RouteComponentProps } from 'react-router';
import { MyCollectionsState } from '../../../containers/paperShowCollectionControlButton/reducer';
import { Paper } from '../../../model/paper';

export interface HeaderProps extends RouteComponentProps<any> {
  layoutState: LayoutState;
  currentUserState: CurrentUser;
  myCollectionsState: MyCollectionsState;
  paper: Paper | undefined;
  dispatch: Dispatch<any>;
}
