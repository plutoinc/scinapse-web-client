import EnvChecker from './envChecker';
import { HistoryInformation, HISTORY_SESSION_KEY } from '../components/locationListener';

export default function restoreScroll(locationKey?: string) {
  if (!EnvChecker.isOnServer()) {
    const histories: HistoryInformation[] = JSON.parse(window.sessionStorage.getItem(HISTORY_SESSION_KEY) || '[]');
    const targetHistory = histories.find(h => h.key === locationKey || (h.key === 'initial' && !locationKey));

    if (targetHistory) {
      window.scrollTo(0, targetHistory.scrollPosition);
    } else {
      window.scrollTo(0, 0);
    }
  }
}
