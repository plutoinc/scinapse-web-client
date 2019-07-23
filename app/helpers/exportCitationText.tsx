import getAPIHost from '../api/getHost';
import { AvailableExportCitationType } from '../containers/paperShow/records';

export function exportCitationText(type: AvailableExportCitationType, selectedPaperIds: number[]) {
  const paperIds = selectedPaperIds.join(',');
  const enumValue = AvailableExportCitationType[type];

  const exportUrl = getAPIHost() + `/citations/export?pids=${paperIds}&format=${enumValue}`;

  window.open(exportUrl, '_blank');
}
