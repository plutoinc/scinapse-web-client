import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button, { GeneralButtonProps } from '../common/button';
import { ButtonSize, ButtonVariant, ButtonColor } from '../common/button/types';
import Icon, { ICONS } from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';

const s = require('./uiDemo.scss');

type AvailableIconPosition = 'left' | 'right' | 'only' | 'no';

const PositionHandledButton: React.FC<
  { iconPosition: AvailableIconPosition; content: string; iconName?: string } & GeneralButtonProps
> = ({ iconPosition, iconName, content, ...props }) => {
  const icon = iconName ? iconName : 'BOOKMARK';

  switch (iconPosition) {
    case 'left':
      return (
        <Button {...props}>
          <Icon icon={icon} />
          <span>{content}</span>
        </Button>
      );
    case 'right':
      return (
        <Button {...props}>
          <span>{content}</span>
          <Icon icon={icon} />
        </Button>
      );
    case 'only':
      return (
        <Button {...props}>
          <Icon icon={icon} />
        </Button>
      );
    case 'no':
      return (
        <Button {...props}>
          <span>{content}</span>
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
  const [icon, setIcon] = React.useState('BOOKMARK');
  const [content, setContent] = React.useState('BUTTON TEXT');

  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];
  const availableIconDisplay: AvailableIconPosition[] = ['left', 'right', 'only', 'no'];

  let buttonCode = '';
  switch (selectedIconPosition) {
    case 'left':
      buttonCode = `<Icon icon="❤️BUTTON_ICON" />
  <span>✍️Button Text</span>`;
      break;

    case 'right':
      buttonCode = `<span>✍️Button Text</span>
  <Icon icon="❤️BUTTON_ICON" />`;
      break;

    case 'only':
      buttonCode = `<Icon icon="❤️BUTTON_ICON" />`;
      break;
    case 'no':
      buttonCode = `<span>✍️Button Text</span>`;
      break;
  }

  const finalCode = `<Button elementType='button' size='${selectedSize}' variant='${selectedVariant}' color='${selectedColor}' fullWidth={${isFullWidth}} disabled={${isDisabled}}>
  ${buttonCode}
</Button>`;

  return (
    <div className={s.uiDemoWrapper}>
      <div className={s.leftBox}>
        <div className={s.demoTitle}>Buttons</div>

        <FormControl className={s.formControl}>
          <InputLabel htmlFor="icon-position-helper">Icon position</InputLabel>
          <Select
            value={selectedIconPosition}
            onChange={e => setSelectedIconPosition(e.target.value as AvailableIconPosition)}
            inputProps={{
              name: 'icon-position',
              id: 'icon-position-helper',
            }}
          >
            {availableIconDisplay.map(iconPosition => {
              return (
                <MenuItem key={iconPosition} value={iconPosition}>
                  {iconPosition}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl className={s.formControl}>
          <InputLabel htmlFor="size-helper">Size</InputLabel>
          <Select
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value as ButtonSize)}
            inputProps={{
              name: 'size',
              id: 'size-helper',
            }}
          >
            {availableSizes.map(size => {
              return (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl className={s.formControl}>
          <InputLabel htmlFor="variant-helper">Variant</InputLabel>
          <Select
            value={selectedVariant}
            onChange={e => setSelectedVariant(e.target.value as ButtonVariant)}
            inputProps={{
              name: 'variant',
              id: 'variant-helper',
            }}
          >
            {availableVariant.map(variant => {
              return (
                <MenuItem key={variant} value={variant}>
                  {variant}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl className={s.formControl}>
          <InputLabel htmlFor="color-helper">Color</InputLabel>
          <Select
            value={selectedColor}
            onChange={e => setSelectedColor(e.target.value as ButtonColor)}
            inputProps={{
              name: 'color',
              id: 'color-helper',
            }}
          >
            {availableColor.map(color => {
              return (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl className={s.formControl}>
          <InputLabel htmlFor="icon-helper">Icon</InputLabel>
          <Select
            value={icon}
            onChange={e => setIcon(e.target.value)}
            inputProps={{
              name: 'icon',
              id: 'icon-helper',
            }}
          >
            {Object.keys(ICONS).map(iconName => {
              return (
                <MenuItem key={iconName} value={iconName}>
                  <Icon icon={iconName} className={s.iconInOption} />
                  {iconName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className={s.formControl}>
          <TextField
            id="content"
            label="Button content"
            value={content}
            onChange={e => setContent(e.target.value)}
            margin="normal"
          />
        </FormControl>

        <div className={s.selectBoxLabel}>Options</div>
        <div className={s.checkboxWrapper}>
          <div className={s.checkboxWrapper}>
            <span className={s.checkboxLabel}>Disabled</span>
            <input
              className={s.checkbox}
              type="checkbox"
              checked={isDisabled}
              onChange={e => setDisabled(e.currentTarget.checked)}
            />
          </div>

          <div className={s.checkboxWrapper}>
            <span className={s.checkboxLabel}>Full Width</span>
            <input
              className={s.checkbox}
              type="checkbox"
              checked={isFullWidth}
              onChange={e => setFullWidth(e.currentTarget.checked)}
            />
          </div>
        </div>
      </div>

      <div className={s.rightBox}>
        <div className={s.exampleButtonContainer}>
          <div className={s.exampleButtonWrapper}>
            <PositionHandledButton
              elementType="button"
              iconName={icon}
              content={content}
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
