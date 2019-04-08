interface HandleInputKeydownParams<L> {
  e: React.KeyboardEvent<HTMLInputElement>;
  list: L[];
  currentIdx: number;
  onMove: (i: number) => void;
  onSelect: (currentIdx: number) => void;
  minIndex?: number;
}

export function handleInputKeydown<L>({
  e,
  list,
  currentIdx,
  onMove,
  onSelect,
  minIndex,
}: HandleInputKeydownParams<L>) {
  const maxIndex = list.length - 1;
  const minIdx = minIndex || -1;
  const nextIdx = currentIdx + 1 > maxIndex ? minIndex || -1 : currentIdx + 1;
  const prevIdx = currentIdx - 1 < minIdx ? maxIndex : currentIdx - 1;

  switch (e.keyCode) {
    case 13: {
      // enter
      e.preventDefault();
      onSelect(currentIdx);
      e.currentTarget.blur();
      break;
    }

    case 9: // tab
    case 40: {
      // down
      if (!list.length) return;
      e.preventDefault();
      onMove(nextIdx);
      break;
    }

    case 38: {
      // up
      if (!list.length) return;
      e.preventDefault();
      onMove(prevIdx);
      break;
    }

    default:
      break;
  }
}
