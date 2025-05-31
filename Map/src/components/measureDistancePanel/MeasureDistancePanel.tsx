import React from 'react';
import { PanelContainer, InputLabel, PointInputGroup, InputField, CalculatedValue, TrashIcon, LabelRow } from '../toolBar/styled';
import type { PointCoordinates } from '../../pages/home/types';

interface MeasureDistancePanelProps {
  distanceStartPoint: PointCoordinates;
  distanceEndPoint: PointCoordinates;
  calculatedDistance: string;
  calculatedAzimuth?: string;
  onStartChange: (coords: PointCoordinates) => void;
  onEndChange: (coords: PointCoordinates) => void;
  onRemove: () => void;

}

const MeasureDistancePanel: React.FC<MeasureDistancePanelProps> = React.memo(({
  distanceStartPoint,
  distanceEndPoint,
  calculatedDistance,
  calculatedAzimuth,
  onStartChange,
  onEndChange,
  onRemove
}) => {
  return (
    <PanelContainer>
      <LabelRow>
        <InputLabel>Počáteční bod (lon/lat):</InputLabel>
        <TrashIcon title="Vymazat měření" onClick={onRemove}>🗑️</TrashIcon>
      </LabelRow>

      <PointInputGroup>
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lon"
          value={Number(distanceStartPoint.lon).toFixed(3)}
          onChange={e => onStartChange({ ...distanceStartPoint, lon: e.target.value })}
        />
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lat"
          value={Number(distanceStartPoint.lat).toFixed(3)}
          onChange={e => onStartChange({ ...distanceStartPoint, lat: e.target.value })}
        />
      </PointInputGroup>

      <InputLabel>Koncový bod (lon/lat):</InputLabel>
      <PointInputGroup>
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lon"
          value={Number(distanceEndPoint.lon).toFixed(3)}
          onChange={e => onEndChange({ ...distanceEndPoint, lon: e.target.value })}
        />
        <InputField
          type="number"
          step= "0.1"
          placeholder="Lat"
          value={Number(distanceEndPoint.lat).toFixed(3)}   
          onChange={e => onEndChange({ ...distanceEndPoint, lat: e.target.value })}
        />
      </PointInputGroup>

      {calculatedDistance && (
        <>
          <InputLabel>Vypočtená vzdálenost:</InputLabel>
          <CalculatedValue>{calculatedDistance}</CalculatedValue>
        </>
      )}
      {calculatedAzimuth && (
        <>
          <InputLabel>Azimut:</InputLabel>
          <CalculatedValue>{calculatedAzimuth}</CalculatedValue>
        </>
      )}
    </PanelContainer>
  );
});

export default MeasureDistancePanel;