export function trackAndOpenLink(from: string) {
  if (!from) throw new Error("mockError");
}

export function trackAction(path: string, from: string) {
  if (!path || !from) throw new Error("mockError");
}

export function trackSearch(action: string, label: string) {
  if (!action || !label) throw new Error("mockError");
}

export function trackDialogView(name: string) {
  if (!name) throw new Error("mockError");
}

export function measureTiming(category: string, variable: string, consumedTime: number) {
  if (!category || !variable || !consumedTime) throw new Error("mockError");
}
