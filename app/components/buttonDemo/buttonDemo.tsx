import React from 'react';
// import { renderToString } from 'react-dom/server'
import Button, { ButtonSize, ButtonVariant, ButtonColor, GeneralButtonProps } from '../common/button/button';
import copySelectedTextToClipboard from '../../helpers/copySelectedTextToClipboard';
import Icon from '../../icons';

type AvailableIconPosition = 'left' | 'right' | 'only' | 'no';

const PositionHandledButton: React.FC<{ iconPosition: AvailableIconPosition } & GeneralButtonProps> = ({
  iconPosition,
  ...props
}) => {
  const copyButtonCode = () => {
    let buttonCode = '';
    switch (iconPosition) {
      case 'left':
        buttonCode = `<Icon icon="BOOKMARK" />
         <span>Bookmark</span>`;
        break;

      case 'right':
        buttonCode = `<span>Bookmark</span>
         <Icon icon="BOOKMARK" />`;
        break;

      case 'only':
        buttonCode = `<Icon icon="BOOKMARK" />`;
        break;
      case 'no':
        buttonCode = `<span>Bookmark</span>`;
        break;
    }

    const finalCode = `
    <Button size='${props.size}' variant='${props.variant}' color='${props.color}' fullWidth={${
      props.fullWidth
    }} disabled={${props.disabled}}>
    ${buttonCode.trim()}
    </Button>
    `;

    console.log(finalCode.trim());
    copySelectedTextToClipboard(finalCode.trim());
  };

  switch (iconPosition) {
    case 'left':
      return (
        <Button {...props} onClick={copyButtonCode}>
          <Icon icon="BOOKMARK" />
          <span>Bookmark</span>
        </Button>
      );
    case 'right':
      return (
        <Button {...props} onClick={copyButtonCode}>
          <span>Bookmark</span>
          <Icon icon="BOOKMARK" />
        </Button>
      );
    case 'only':
      return (
        <Button {...props} onClick={copyButtonCode}>
          <Icon icon="BOOKMARK" />
        </Button>
      );
    case 'no':
      return (
        <Button {...props} onClick={copyButtonCode}>
          <span>Bookmark</span>
        </Button>
      );
  }
};

const ButtonDemo: React.FC = () => {
  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];
  const availableFullWidth = [false, true];
  const availableDisabled = [false, true];
  const availableIconDisplay: AvailableIconPosition[] = ['left', 'right', 'only', 'no'];

  const allButtons = availableDisabled.map(disabled => {
    return availableFullWidth.map(fullWidth => {
      return availableIconDisplay.map(iconDisplay => {
        return availableSizes.map(size => {
          return availableColor.map(color => {
            return availableVariant.map(variant => {
              return (
                <div style={{ margin: '16px 0' }} key={size + variant + color}>
                  <div style={{ display: 'inline-block', width: '200px' }}>
                    <PositionHandledButton
                      elementType="button"
                      disabled={disabled}
                      fullWidth={fullWidth}
                      size={size}
                      color={color}
                      variant={variant}
                      iconPosition={iconDisplay}
                    />
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
