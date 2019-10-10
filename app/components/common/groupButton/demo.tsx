import React from 'react';
import GroupButton from './';
import Button from '../button';

const GroupButtonDemo: React.FC = () => {
  return (
    <div style={{ marginTop: '100px', textAlign: 'center' }}>
      <GroupButton variant="text">
        <Button elementType="button" size="large" color="black" variant="text">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="blue" variant="text">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="text">
        <Button elementType="button" size="large" color="black" variant="text">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="blue" variant="text">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="blue" variant="text">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="outlined">
        <Button elementType="button" size="large" color="black" variant="outlined">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="blue" variant="outlined">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="outlined">
        <Button elementType="button" size="large" color="black" variant="outlined">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="blue" variant="outlined">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="blue" variant="outlined">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="contained" buttonBackgroundColor="gray">
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="contained" buttonBackgroundColor="gray">
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="contained" buttonBackgroundColor="gray">
        <Button elementType="button" size="large" color="gray">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="gray">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton variant="contained" buttonBackgroundColor="gray">
        <Button elementType="button" size="large" color="gray">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="gray">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="gray">
          <span>Button Text</span>
        </Button>
      </GroupButton>

      <GroupButton>
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large" color="black">
          <span>Button Text</span>
        </Button>
        <Button elementType="button" size="large">
          <span>Button Text</span>
        </Button>
      </GroupButton>
    </div>
  );
};

export default GroupButtonDemo;
