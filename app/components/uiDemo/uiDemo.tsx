import React from 'react';
// import { renderToString } from 'react-dom/server'
import Button, { GeneralButtonProps } from '../common/button/button';
import { ButtonSize, ButtonVariant, ButtonColor } from '../common/button/types';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';

const s = require('./uiDemo.scss');

type AvailableIconPosition = 'left' | 'right' | 'only' | 'no';

const PositionHandledButton: React.FC<{ iconPosition: AvailableIconPosition } & GeneralButtonProps> = ({
  iconPosition,
  ...props
}) => {
  switch (iconPosition) {
    case 'left':
      return (
        <Button {...props}>
          <Icon icon="BOOKMARK" />
          <span>Bookmark</span>
        </Button>
      );
    case 'right':
      return (
        <Button {...props}>
          <span>Bookmark</span>
          <Icon icon="BOOKMARK" />
        </Button>
      );
    case 'only':
      return (
        <Button {...props}>
          <Icon icon="BOOKMARK" />
        </Button>
      );
    case 'no':
      return (
        <Button {...props}>
          <span>Bookmark</span>
        </Button>
      );
  }
};

const UiDemo: React.FunctionComponent = () => {
  const [selectedSize, setSelectedSize] = React.useState<ButtonSize>('small');
  const [selectedVariant, setSelectedVariant] = React.useState<ButtonVariant>('contained');
  const [selectedIconPosition, setSelectedIconPosition] = React.useState<AvailableIconPosition>('left');
  const [selectedColor, setSelectedColor] = React.useState<ButtonColor>('blue');
  const [isDisabled, setDisabled] = React.useState(false);
  const [isFullWidth, setFullWidth] = React.useState(false);

  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];
  const availableIconDisplay: AvailableIconPosition[] = ['left', 'right', 'only', 'no'];

  let buttonCode = '';
  switch (selectedIconPosition) {
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

  const finalCode = `<Button size='${selectedSize}' variant='${selectedVariant}' color='${selectedColor}' fullWidth={${isFullWidth}} disabled={${isDisabled}}>
  ${buttonCode}
</Button>`;

  return (
    <div className={s.uiDemoWrapper}>
      <div className={s.leftBox}>
        <select
          className={s.selectBox}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => setSelectedIconPosition(e.currentTarget.value as any)}
        >
          {availableIconDisplay.map(iconPosition => {
            return (
              <option key={iconPosition} value={iconPosition}>
                {iconPosition}
              </option>
            );
          })}
        </select>
        <select
          className={s.selectBox}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => setSelectedSize(e.currentTarget.value as any)}
        >
          {availableSizes.map(size => {
            return (
              <option key={size} value={size}>
                {size}
              </option>
            );
          })}
        </select>
        <select
          className={s.selectBox}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => setSelectedVariant(e.currentTarget.value as any)}
        >
          {availableVariant.map(variant => {
            return (
              <option key={variant} value={variant}>
                {variant}
              </option>
            );
          })}
        </select>
        <select
          className={s.selectBox}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => setSelectedColor(e.currentTarget.value as any)}
        >
          {availableColor.map(color => {
            return (
              <option key={color} value={color}>
                {color}
              </option>
            );
          })}
        </select>

        <div className={s.toggle}>
          <span className={s.toggleLabel}>Disabled</span>
          <input
            className={s.checkbox}
            type="checkbox"
            checked={isDisabled}
            onChange={e => setDisabled(e.currentTarget.checked)}
          />
        </div>

        <div className={s.toggle}>
          <span className={s.toggleLabel}>Full Width</span>
          <input
            className={s.checkbox}
            type="checkbox"
            checked={isFullWidth}
            onChange={e => setFullWidth(e.currentTarget.checked)}
          />
        </div>
      </div>

      <div className={s.rightBox}>
        <div className={s.exampleButtonContainer}>
          <div className={s.exampleButtonWrapper}>
            <PositionHandledButton
              elementType="button"
              iconPosition={selectedIconPosition}
              size={selectedSize}
              variant={selectedVariant}
              color={selectedColor}
              disabled={isDisabled}
              fullWidth={isFullWidth}
            />
          </div>
        </div>

        <div className={s.buttonCodeContainer}>
          <pre className={s.buttonCodeWrapper}>
            <code>{finalCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof UiDemo>(s)(UiDemo);
