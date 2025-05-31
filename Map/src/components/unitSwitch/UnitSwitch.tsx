import React from 'react';
import  { UnitSelectorContainer, UnitGroup, RadioSegmentLabel, GroupLabel, RadioButtonGroup } from './styled';

interface UnitSwitcherProps {
  distanceUnit: "km" | "mi";
  onDistanceUnitChange: (unit: 'km'| 'mi') => void;
  angleUnit: "deg" | "rad";
  onAngleUnitChange: (unit:  'deg'| 'rad') => void;
}

const UnitSwitcher: React.FC<UnitSwitcherProps> = React.memo(({
  distanceUnit,
  onDistanceUnitChange,
  angleUnit,
  onAngleUnitChange,
}) => {
  return (
    <UnitSelectorContainer>
      <UnitGroup>
        <GroupLabel>Vzdálenost:</GroupLabel>
        <RadioButtonGroup>
          <RadioSegmentLabel isActive={distanceUnit === 'km'}>
            <input
              type="radio"
              name="distanceUnitSwitcher"
              value="km"
              checked={distanceUnit === 'km'}
              onChange={() => onDistanceUnitChange('km')}
            />
            km
          </RadioSegmentLabel>
          <RadioSegmentLabel isActive={distanceUnit === 'mi'}>
            <input
              type="radio"
              name="distanceUnitSwitcher"
              value="mi"
              checked={distanceUnit === 'mi'}
              onChange={() => onDistanceUnitChange('mi')}
            />
            mi
          </RadioSegmentLabel>
        </RadioButtonGroup>
      </UnitGroup>

      <UnitGroup>
        <GroupLabel>Úhel:</GroupLabel>
        <RadioButtonGroup>
          <RadioSegmentLabel isActive={angleUnit === 'deg'}>
            <input
              type="radio"
              name="angleUnitSwitcher" 
              value="deg"
              checked={angleUnit === 'deg'}
              onChange={() => onAngleUnitChange('deg')}
            />
            deg
          </RadioSegmentLabel>
          <RadioSegmentLabel isActive={angleUnit === 'rad'}>
            <input
              type="radio"
              name="angleUnitSwitcher"
              value="rad"
              checked={angleUnit === 'rad'}
              onChange={() => onAngleUnitChange('rad')}
            />
            rad
          </RadioSegmentLabel>
        </RadioButtonGroup>
      </UnitGroup>
    </UnitSelectorContainer>
  );
});

export default UnitSwitcher;