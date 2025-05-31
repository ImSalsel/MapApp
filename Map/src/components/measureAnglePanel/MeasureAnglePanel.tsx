import React from 'react';
import { CalculatedValue, InputField, InputLabel, LabelRow, PanelContainer, PointInputGroup, TrashIcon } from '../toolBar/styled';
import type { PointCoordinates } from '../../pages/home/types';

interface MeasureAnglePanelProps {
  anglePointA: PointCoordinates;
  setAnglePointA: (point: PointCoordinates) => void;
  anglePointB: PointCoordinates;
  setAnglePointB: (point: PointCoordinates) => void;
  anglePointC: PointCoordinates;
  setAnglePointC: (point: PointCoordinates) => void;
  calculatedAngle: string; 
  onRemove: () => void;
}

const MeasureAnglePanel: React.FC<MeasureAnglePanelProps> = React.memo(({
  anglePointA,
  setAnglePointA,
  anglePointB,
  setAnglePointB,
  anglePointC,
  setAnglePointC,
  calculatedAngle,
  onRemove
}) => {
  return (
    <PanelContainer>
      <LabelRow>
      <InputLabel>Bod A (lon/lat):</InputLabel>
      <TrashIcon title="Vymazat měření" onClick={onRemove}>🗑️</TrashIcon>
      </LabelRow>

      <PointInputGroup>
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lon"
          value={Number(anglePointA.lon).toFixed(3)}
          onChange={e => setAnglePointA({ ...anglePointA, lon: e.target.value })}
        />
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lat"
          value={Number(anglePointA.lat).toFixed(3)}
          onChange={e => setAnglePointA({ ...anglePointA, lat: e.target.value })}
        />
      </PointInputGroup>

      <InputLabel>Bod B (lon/lat):</InputLabel>
      <PointInputGroup>
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lon"
          value={Number(anglePointB.lon).toFixed(3)}
          onChange={e => setAnglePointB({ ...anglePointB, lon: e.target.value })}
        />
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lat"
          value={Number(anglePointB.lat).toFixed(3)}
          onChange={e => setAnglePointB({ ...anglePointB, lat: e.target.value })}
        />
      </PointInputGroup>

      <InputLabel>Bod C (lon/lat):</InputLabel>
      <PointInputGroup>
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lon"
          value={Number(anglePointC.lon).toFixed(3)}
          onChange={e => setAnglePointC({ ...anglePointC, lon: e.target.value })}
        />
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lat"
          value={Number(anglePointC.lat).toFixed(3)}
          onChange={e => setAnglePointC({ ...anglePointC, lat: e.target.value })}
        />
      </PointInputGroup>

      {calculatedAngle && (
        <>
          <InputLabel>Vypočtený úhel:</InputLabel>
          <CalculatedValue>{calculatedAngle}</CalculatedValue>
        </>
      )}
    </PanelContainer>
  );
});

export default MeasureAnglePanel;