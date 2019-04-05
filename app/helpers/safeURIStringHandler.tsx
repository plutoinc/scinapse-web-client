export default class SafeURIStringHandler {
  public static decode(rawString: string): string {
    try {
      return decodeURIComponent(rawString);
    } catch (_err) {
      return rawString;
    }
  }
}
