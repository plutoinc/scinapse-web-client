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
import GroupButton from '../common/groupButton';

const s = require('./uiDemo.scss');

type AvailableIconPosition = 'left' | 'right' | 'only' | 'no';

const PositionHandledButton: React.FC<
  {
    iconPosition: AvailableIconPosition;
    content: string;
    iconName?: string;
    combinedButtonIcon?: string;
  } & GeneralButtonProps
> = ({ iconPosition, iconName, content, combinedButtonIcon, ...props }) => {
  const icon = iconName ? iconName : 'BOOKMARK';

  let button = null;

  switch (iconPosition) {
    case 'left':
      button = (
        <Button {...props}>
          <Icon icon={icon} />
          <span>{content}</span>
        </Button>
      );
      break;
    case 'right':
      button = (
        <Button {...props}>
          <span>{content}</span>
          <Icon icon={icon} />
        </Button>
      );
      break;
    case 'only':
      button = (
        <Button {...props}>
          <Icon icon={icon} />
        </Button>
      );
      break;
    case 'no':
      button = (
        <Button {...props}>
          <span>{content}</span>
        </Button>
      );
      break;
  }

  if (combinedButtonIcon === 'NONE') return button;

  return (
    <GroupButton variant={props.variant} color={props.color} disabled={props.disabled}>
      {button}
      <Button {...props}>
        <Icon icon={combinedButtonIcon!} />
      </Button>
    </GroupButton>
  );
};

const PositionHandledButtonString = ({
  iconPosition,
  iconName,
  content,
  combinedButtonIcon,
  ...props
}: {
  iconPosition: AvailableIconPosition;
  content: string;
  iconName?: string;
  combinedButtonIcon?: string;
} & GeneralButtonProps) => {
  const icon = iconName ? iconName : 'BOOKMARK';

  const propsString = Object.keys(props)
    .map(key => {
      if (key === 'color' && (props as any)[key] === 'blue') return;
      if (key === 'variant' && (props as any)[key] === 'contained') return;
      if (key === 'size' && (props as any)[key] === 'medium') return;
      if (key === 'fullWidth' && !(props as any)[key]) return;
      if (key === 'disabled' && !(props as any)[key]) return;
      if (typeof (props as any)[key] === 'string') {
        return `${key}='${(props as any)[key]}'`;
      }
      return `${key}={${(props as any)[key]}}`;
    })
    .filter(prop => !!prop)
    .join(' ');

  let buttonString = '';

  switch (iconPosition) {
    case 'left':
      buttonString = `
<Button ${propsString}>
  <Icon icon='${icon}' />
  <span>${content}</span>
</Button>`;
      break;
    case 'right':
      buttonString = `
<Button ${propsString}>
  <span>{content}</span>
  <Icon icon='${icon}' />
</Button>`;
      break;
    case 'only':
      buttonString = `
<Button ${propsString}>
  <Icon icon='${icon}' />
</Button>`;
      break;
    case 'no':
      buttonString = `
<Button ${propsString}>
  <span>{content}</span>
</Button>`;
      break;
  }

  if (combinedButtonIcon === 'NONE') return buttonString;

  const combinedButtonString = `
<Button ${propsString}>
  <Icon icon='${combinedButtonIcon}' />
</Button>`;

  return `
<GroupButton variant='${props.variant}' color='${props.color}' disabled={${
    props.disabled
  }}>${buttonString}${combinedButtonString}
</GroupButton>
  `;
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
  const [combinedButtonIcon, setCombinedButtonIcon] = React.useState('NONE');

  const availableSizes: ButtonSize[] = ['small', 'medium', 'large'];
  const availableVariant: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const availableColor: ButtonColor[] = ['blue', 'gray', 'black'];
  const availableIconDisplay: AvailableIconPosition[] = ['left', 'right', 'only', 'no'];

  const orderdIconList = Object.keys(ICONS).sort((a, b) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });

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
            {orderdIconList.map(iconName => {
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

        <FormControl className={s.formControl}>
          <InputLabel htmlFor="icon-helper">COMBINED BUTTON</InputLabel>
          <Select
            value={combinedButtonIcon}
            onChange={e => setCombinedButtonIcon(e.target.value)}
            inputProps={{
              name: 'icon',
              id: 'icon-helper',
            }}
          >
            <MenuItem key="NONE" value="NONE">
              NONE
            </MenuItem>
            {orderdIconList.map(iconName => {
              return (
                <MenuItem key={iconName} value={iconName}>
                  <Icon icon={iconName} className={s.iconInOption} />
                  {iconName}
                </MenuItem>
              );
            })}
          </Select>
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
              combinedButtonIcon={combinedButtonIcon}
            />
          </div>
        </div>

        <div className={s.buttonCodeContainer}>
          <pre className={s.buttonCodeWrapper}>
            <code>
              {PositionHandledButtonString({
                elementType: 'button',
                iconName: icon,
                content: content,
                iconPosition: selectedIconPosition,
                size: selectedSize,
                variant: selectedVariant,
                color: selectedColor,
                disabled: isDisabled,
                fullWidth: isFullWidth,
                combinedButtonIcon: combinedButtonIcon,
              }).trim()}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof UiDemo>(s)(UiDemo);
