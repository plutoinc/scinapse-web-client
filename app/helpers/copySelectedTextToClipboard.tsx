import UserAgentHelper from './userAgentHelper';
import alertToast from './makePlutoToastAction';

export default function copySelectedTextToClipboard(text: string) {
  const browser = UserAgentHelper.getBrowser();

  try {
    if (browser && browser.name.match(/IE/gi)) {
      (window as any).clipboardData.setData('Text', text);
    } else {
      const textField = document.createElement('textarea');
      textField.textContent = text;
      textField.style.whiteSpace = 'pre';
      document.body.appendChild(textField);

      const selection = document.getSelection();
      const range = document.createRange();
      range.selectNode(textField);

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        document.body.removeChild(textField);
      } else {
        document.body.removeChild(textField);
      }
    }

    alertToast({
      type: 'success',
      message: 'Copied',
    });
  } catch (err) {
    alertToast({
      type: 'error',
      message: 'Failed to copy the given text. Please use other browser(we recommend the latest Chrome browser.)',
    });
  }
}
