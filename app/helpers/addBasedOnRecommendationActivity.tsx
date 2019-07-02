import GlobalDialogManager from './globalDialogManager';
import homeAPI from '../api/home';

export function addBasedOnRecommendationActivity(isLoggedIn: boolean, paperId: number) {
  if (!isLoggedIn) return;

  GlobalDialogManager.openKnowledgeBaseNotiDialog();
  homeAPI.addBasedOnRecommendationPaper(paperId);
}
