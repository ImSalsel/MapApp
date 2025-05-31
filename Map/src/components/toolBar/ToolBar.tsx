import React, { useCallback } from 'react';
import { ToolbarContainer, ToolButton, ToolButtonsRow, ActiveToolPanelContainer } from './styled';
import MeasureAnglePanel from '../measureAnglePanel/MeasureAnglePanel';
import MeasureDistancePanel from '../measureDistancePanel/MeasureDistancePanel';
import UnitSwitcher from '../unitSwitch/UnitSwitch';
import type { PointCoordinates } from '../../pages/home/types'; 
import PolylinePanel from '../polylinePanel/PolylinePanel';
import { useAppContext } from '../../hooks/useAppContext';



interface ToolBarProps {
  // props pro měření vzdálenosti 
  distanceStartPoint: PointCoordinates;
  distanceEndPoint: PointCoordinates;
  calculatedDistance: string;
  calculatedAzimuth?: string;
  setDistanceStartPoint: (point: PointCoordinates) => void;
  setDistanceEndPoint: (point: PointCoordinates) => void;

  // props pro mereni uhlu 
  anglePointA: PointCoordinates;
  setAnglePointA: (point: PointCoordinates) => void;
  anglePointB: PointCoordinates;
  setAnglePointB: (point: PointCoordinates) => void;
  anglePointC: PointCoordinates;
  setAnglePointC: (point: PointCoordinates) => void;
  calculatedAngle: string; 

  // props pro polyline 
  polylinePoints: PointCoordinates[];
  polylineSegments: { start: PointCoordinates; end: PointCoordinates; length: string; azimuth: string }[]; 
  addPolylinePoint: (point: PointCoordinates) => void;
  updatePolylinePoint: (idx: number, coords: PointCoordinates) => void;
  setPolylinePoints: (points: PointCoordinates[]) => void;
  onEditPolylineSegment: (index: number | null) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  distanceStartPoint,
  distanceEndPoint,
  calculatedDistance,
  anglePointA,
  setAnglePointA,
  anglePointB,
  setAnglePointB,
  anglePointC,
  setAnglePointC,
  calculatedAzimuth,
  setDistanceStartPoint,
  setDistanceEndPoint,
  calculatedAngle, 
  polylinePoints,
  polylineSegments,
  addPolylinePoint,
  updatePolylinePoint,
  setPolylinePoints,
  onEditPolylineSegment
}) => {

  const {
    activeTool,
    setActiveTool,
    distanceUnit,
    setDistanceUnit,
    angleUnit,
    setAngleUnit,
    measureLineSource,
    measureAngleSource,
    polylineSource,
  } = useAppContext();

  // Callback pro přepínání nástrojů
  const handleToolToggle = useCallback((toolType: Exclude<typeof activeTool, null>) => {
    setActiveTool(currentActiveTool => (currentActiveTool === toolType ? null : toolType));
  }, [setActiveTool]); 

  // Callbacky pro odstranění měření vzdálenosti
  const onRemoveDistance = useCallback(() => {
    setDistanceStartPoint({ lon: '', lat: '' });
    setDistanceEndPoint({ lon: '', lat: '' });
    if (measureLineSource) { 
        measureLineSource.clear();
    }
  }, [setDistanceStartPoint, setDistanceEndPoint, measureLineSource]);

  // Callbacky pro odstranění měření úhlu
  const onRemoveAngle = useCallback(() => {
    setAnglePointA({ lon: '', lat: '' });
    setAnglePointB({ lon: '', lat: '' });
    setAnglePointC({ lon: '', lat: '' });
    if (measureAngleSource) { 
        measureAngleSource.clear();
    }
  }, [setAnglePointA, setAnglePointB, setAnglePointC, measureAngleSource]);

  // Callbacky pro odstranění polyline
  const onRemovePolyline = useCallback(() => {
    setPolylinePoints([]); 
    if (polylineSource) {
        polylineSource.clear();
    }
  }, [setPolylinePoints, polylineSource]);

  return (
    <ToolbarContainer>
      <UnitSwitcher
        distanceUnit={distanceUnit} 
        onDistanceUnitChange={setDistanceUnit}
        angleUnit={angleUnit} 
        onAngleUnitChange={setAngleUnit} 
      />
      <ToolButtonsRow>
        <ToolButton
          onClick={() => handleToolToggle('measureDistance')}
          className={activeTool === 'measureDistance' ? 'active' : ''}
        >
          Měření vzdálenosti
        </ToolButton>
        <ToolButton
          onClick={() => handleToolToggle('measureAngle')}
          className={activeTool === 'measureAngle' ? 'active' : ''}
        >
          Měření úhlu
        </ToolButton>
        <ToolButton
          onClick={() => handleToolToggle('polyline')}
          className={activeTool === 'polyline' ? 'active' : ''}
        >
          Kreslení polyčáry
        </ToolButton>
      </ToolButtonsRow>

      <ActiveToolPanelContainer>
        {activeTool === 'measureDistance' && (
          <MeasureDistancePanel
            distanceStartPoint={distanceStartPoint}
            distanceEndPoint={distanceEndPoint}
            calculatedDistance={calculatedDistance}
            calculatedAzimuth={calculatedAzimuth}
            onStartChange={setDistanceStartPoint}
            onEndChange={setDistanceEndPoint}
            onRemove={onRemoveDistance}
          />
        )}
        {activeTool === 'measureAngle' && (
          <MeasureAnglePanel
            anglePointA={anglePointA}
            setAnglePointA={setAnglePointA}
            anglePointB={anglePointB}
            setAnglePointB={setAnglePointB}
            anglePointC={anglePointC}
            setAnglePointC={setAnglePointC}
            calculatedAngle={calculatedAngle} 
            onRemove={onRemoveAngle}
          />
        )}
        {activeTool === 'polyline' && (
          <PolylinePanel
            points={polylinePoints}
            segments={polylineSegments} 
            onPointChange={updatePolylinePoint}
            onAddPoint={addPolylinePoint}
            distanceUnit={distanceUnit} 
            angleUnit={angleUnit} 
            onRemove={onRemovePolyline}
            onEditSegment={onEditPolylineSegment}
          />
        )}
      </ActiveToolPanelContainer>
    </ToolbarContainer>
  );
};

export default ToolBar;