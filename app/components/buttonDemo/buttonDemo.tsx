import React from 'react';
import Button, { ButtonSize, ButtonVariant, ButtonColor } from '../common/button/button';
import copySelectedTextToClipboard from '../../helpers/copySelectedTextToClipboard';
import Icon from '../../icons';

const ButtonDemo: React.FC = () => {
  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];
  const availableFullWidth = [false, true];
  const availableDisabled = [false, true];
  const availableIconDisplay = ['left', 'right', 'only', 'no'];

  const copyButtonCode = () => {
    // 이 부분 어떻게 짜는지 모르겠음.
    // 버튼 클릭하면 해당 버튼의 Rendering 코드를 clipboard에 copy하는 함수임.
    alert('Copied: ' + this.target);
    copySelectedTextToClipboard(this.target);
  };

  const allButtons = availableDisabled.map(disabled => {
    return availableFullWidth.map(fullWidth => {
      return availableIconDisplay.map(iconDisplay => {
        return availableSizes.map(size => {
          return availableColor.map(color => {
            return availableVariant.map(variant => {
              return (
                <div style={{ margin: '16px 0' }} key={size + variant + color}>
                  <div style={{ display: 'inline-block', width: '200px' }}>
                    {/* 이 부분 깔끔하게 바꾸면 좋겠음.. */}
                    {(() => {
                      switch (iconDisplay) {
                        case 'left':
                          return (
                            <Button
                              onClick={copyButtonCode}
                              type="button"
                              size={size}
                              variant={variant}
                              color={color}
                              fullWidth={fullWidth}
                              disabled={disabled}
                            >
                              <Icon icon="BOOKMARK" />
                              <span>Bookmark</span>
                            </Button>
                          );
                        case 'right':
                          return (
                            <Button
                              onClick={copyButtonCode}
                              type="button"
                              size={size}
                              variant={variant}
                              color={color}
                              fullWidth={fullWidth}
                              disabled={disabled}
                            >
                              <span>Bookmark</span>
                              <Icon icon="BOOKMARK" />
                            </Button>
                          );
                        case 'only':
                          return (
                            <Button
                              onClick={copyButtonCode}
                              type="button"
                              size={size}
                              variant={variant}
                              color={color}
                              fullWidth={false}
                              disabled={disabled}
                            >
                              <Icon icon="BOOKMARK" />
                            </Button>
                          );
                        case 'no':
                          return (
                            <Button
                              onClick={copyButtonCode}
                              type="button"
                              size={size}
                              variant={variant}
                              color={color}
                              fullWidth={fullWidth}
                              disabled={disabled}
                            >
                              <span>Bookmark</span>
                            </Button>
                          );
                      }
                    })()}
                  </div>
                  <small style={{ display: 'inline-block', textAlign: 'center', margin: '8px', color: '#666666' }}>
                    {`${size}/${variant}/${color}/fullWidth=${fullWidth}/disalbed=${disabled}/icon=${iconDisplay}`}
                  </small>
                </div>
              );
            });
          });
        });
      });
    });
  });

  return (
    <div
      style={{
        margin: '100px auto',
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {allButtons}
    </div>
  );
};

export default ButtonDemo;
