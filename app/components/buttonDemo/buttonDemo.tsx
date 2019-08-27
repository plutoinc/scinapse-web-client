import React from 'react';
import Button, { ButtonSize, ButtonVariant, ButtonColor } from '../common/button/button';
import Icon from '../../icons';

const ButtonDemo: React.FC = () => {
  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];

  const basicButtons = availableVariant.map(variant => {
    return availableColor.map(color => {
      return availableSizes.map(size => {
        return (
          <div style={{ margin: '10px 0', textAlign: 'center' }} key={size + variant + color}>
            <Button size={size} variant={variant} color={color}>
              <Icon icon="BOOKMARK" />
              <span>Bookmark</span>
            </Button>
            <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
              {`basic button : ${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  const rightIconBasicButtons = availableVariant.map(variant => {
    return availableColor.map(color => {
      return availableSizes.map(size => {
        return (
          <div style={{ margin: '10px 0', textAlign: 'center' }} key={size + variant + color}>
            <Button size={size} variant={variant} color={color}>
              <span>Bookmark</span>
              <Icon icon="BOOKMARK" />
            </Button>
            <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
              {`basic button : ${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  const onlyTextButtons = availableVariant.map(variant => {
    return availableColor.map(color => {
      return availableSizes.map(size => {
        return (
          <div style={{ margin: '10px 0', textAlign: 'center' }} key={size + variant + color}>
            <Button size={size} variant={variant} color={color}>
              <span>Bookmark</span>
            </Button>
            <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
              {`only text button : ${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  const onlyIconButtons = availableVariant.map(variant => {
    return availableColor.map(color => {
      return availableSizes.map(size => {
        return (
          <div style={{ margin: '10px 0', textAlign: 'center' }} key={size + variant + color}>
            <Button size={size} variant={variant} color={color}>
              <Icon icon="BOOKMARK" />
            </Button>
            <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
              {`only icon button : ${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  const basicFullWidthButtons = availableVariant.map(variant => {
    return availableColor.map(color => {
      return availableSizes.map(size => {
        return (
          <div
            style={{ margin: '10px 0', textAlign: 'center', width: '200px', display: 'inline' }}
            key={size + variant + color}
          >
            <Button size={size} variant={variant} color={color} fullWidth={true}>
              <Icon icon="BOOKMARK" />
              <span>Bookmark</span>
            </Button>
            <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
              {` basic full-width button : ${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  const onlyTextFullWidthButtons = availableVariant.map(variant => {
    return availableColor.map(color => {
      return availableSizes.map(size => {
        return (
          <div
            style={{ margin: '10px 0', textAlign: 'center', width: '200px', display: 'inline' }}
            key={size + variant + color}
          >
            <Button size={size} variant={variant} color={color} fullWidth={true}>
              <Icon icon="BOOKMARK" />
              <span>Sign up</span>
            </Button>
            <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
              {`only text full-width button : ${size}/${variant}/${color}`}
            </small>
          </div>
        );
      });
    });
  });

  const disbaledButtons = availableVariant.map(variant => {
    return availableSizes.map(size => {
      return (
        <div style={{ margin: '10px 0', textAlign: 'center', width: '200px', display: 'inline' }} key={size + variant}>
          <Button size={size} variant={variant} disabled={true}>
            <Icon icon="BOOKMARK" />
            <span>Confirm</span>
          </Button>
          <small style={{ display: 'block', textAlign: 'center', margin: '8px', color: '#666666' }}>
            {`disabled button : ${size}/${variant}`}
          </small>
        </div>
      );
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
      {basicButtons}
      {rightIconBasicButtons}
      {onlyTextButtons}
      {onlyIconButtons}
      {basicFullWidthButtons}
      {onlyTextFullWidthButtons}
      {disbaledButtons}
    </div>
  );
};

export default ButtonDemo;
