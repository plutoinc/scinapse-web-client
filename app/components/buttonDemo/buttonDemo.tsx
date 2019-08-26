import React from 'react';
import Button, { ButtonSize, ButtonVariant, ButtonColor } from '../common/button/button';
import Icon from '../../icons';

const ButtonDemo: React.FC = () => {
  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['text', 'outlined', 'contained'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];

  const buttons = availableSizes.map(size => {
    return availableVariant.map(variant => {
      return availableColor.map(color => {
        return (
          <div style={{ margin: '10px 0', textAlign: 'center' }} key={size + variant + color}>
            <Button size={size} variant={variant} color={color}>
              <Icon icon="BOOKMARK" />
              <span>Bookmark</span>
            </Button>
            <small style={{ display: 'block', textAlign: 'center', marginTop: '2px' }}>
              {`${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  return (
    <div
      style={{
        margin: '100px auto',
        width: '1200px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {buttons}
    </div>
  );
};

export default ButtonDemo;
