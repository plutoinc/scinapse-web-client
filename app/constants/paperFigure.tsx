import { PaperFigure } from '../model/paper';
import GlobalDialogManager from '../helpers/globalDialogManager';

export const FIGURE_PREFIX = 'https://asset-pdf.scinapse.io/';

export function openPaperFigureDetailDialog(figures: PaperFigure[], index: number) {
  return GlobalDialogManager.openPaperFigureDetailDialog(figures, index);
}
