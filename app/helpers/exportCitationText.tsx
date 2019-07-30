import getAPIHost from '../api/getHost';
import { AvailableExportCitationType } from '../containers/paperShow/records';
import axios from 'axios';

export async function exportCitationText(type: AvailableExportCitationType, selectedPaperIds: number[]) {
  const paperIds = selectedPaperIds.join(',');
  const enumValue = AvailableExportCitationType[type];

  const exportUrl = getAPIHost() + `/citations/export?pids=${paperIds}&format=${enumValue}`;

  await axios
    .get(exportUrl)
    .then(() => {
      window.location.href = exportUrl;
    })
    .catch(() => {
      window.alert('Selected papers can not export citation.');
    });
}
