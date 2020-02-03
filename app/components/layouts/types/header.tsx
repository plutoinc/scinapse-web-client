import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { LayoutState } from '../reducer';
import { CurrentUser } from '../../../model/currentUser';
import { MyCollectionsState } from '../../../containers/paperShowCollectionControlButton/reducer';
import { Paper } from '../../../model/paper';
import { Profile } from '../../../model/profile';

export interface HeaderProps extends RouteComponentProps<any> {
  profile: Profile;
  layoutState: LayoutState;
  currentUserState: CurrentUser;
  myCollectionsState: MyCollectionsState;
  paper: Paper | null;
  dispatch: Dispatch<any>;
}
