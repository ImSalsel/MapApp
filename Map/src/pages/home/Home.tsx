import React, { useRef, useState, useCallback } from 'react'; 

import { HomeContainer, MapContainer } from './styled';
import ToolBar from '../../components/toolBar/ToolBar';
import { useMap } from '../../hooks/useMap';
import { useMeasureLine } from '../../hooks/useMeasureLine';
import { useMeasureAngle } from '../../hooks/useMeasureAngle';
import type { PointCoordinates, PolylineSegment } from './types'; 
import { useDrawPolyline } from '../../hooks/useDrawPolyline';
import { useAppContext } from '../../hooks/useAppContext';

const Home: React.FC = () => {
  
  const mapRef = useRef<HTMLDivElement>(null!);
  const { mapInstance } = useMap(mapRef); 

  const {
    activeTool, 
    distanceUnit,
    angleUnit, 
    measureLineSource, 
    measureAngleSource,
    polylineSource,
  } = useAppContext();

  // state pro uchování souřadnic bodů pro měření vdálenosti
  const [distanceStartPoint, setDistanceStartPoint] = useState<PointCoordinates>({ lon: '', lat: '' });
  const [distanceEndPoint, setDistanceEndPoint] = useState<PointCoordinates>({ lon: '', lat: '' });

  // state pro uchování souřadnic bodů pro měření úhlu
  const [anglePointA, setAnglePointA] = useState<PointCoordinates>({ lon: '', lat: '' });
  const [anglePointB, setAnglePointB] = useState<PointCoordinates>({ lon: '', lat: '' });
  const [anglePointC, setAnglePointC] = useState<PointCoordinates>({ lon: '', lat: '' });

  // state pro uchování vypočítaných hodnot
  const [calculatedDistance, setCalculatedDistance] = useState('');
  const [calculatedAzimuth, setCalculatedAzimuth] = useState('');
  const [calculatedAngle, setCalculatedAngle] = useState('');

  // state pro uchování bodů tvořících polyline
  const [polylinePoints, setPolylinePoints] = useState<PointCoordinates[]>([
    { lon: '', lat: '' },
    { lon: '', lat: '' },
  ]);


  // state pro uchování údaju o segmentech polyline
  const [polylineSegments, setPolylineSegments] = useState<PolylineSegment[]>([]);

  // state pro uchování indexu zvýrazněného segmentu polyline
  const [highlightedPolylineSegmentIndex, setHighlightedPolylineSegmentIndex] = useState<number | null>(null); 

  // callback pro přidání bodu do polyline
  const addPolylinePoint = useCallback((point: PointCoordinates) => {
    setPolylinePoints(points => [...points, point]);
  }, []);

  // callback pro aktualizaci bodu v polyline podle indexu
  const updatePolylinePoint = useCallback((idx: number, coords: PointCoordinates) => {
    setPolylinePoints(points => points.map((pt, i) => i === idx ? coords : pt));
  }, []);

  // hook pro kreslení polyline
  useDrawPolyline({
    mapInstance,
    active: activeTool === 'polyline',
    points: polylinePoints,
    setPoints: setPolylinePoints, 
    distanceUnit,
    angleUnit,
    vectorSource: polylineSource, 
    onSegmentsChange: setPolylineSegments, 
    highlightedSegmentIndex: highlightedPolylineSegmentIndex,
  });

  // hook pro měření vzdálenosti a azimutu
  useMeasureLine({
    mapInstance,
    active: activeTool === 'measureDistance',
    distanceStartPoint,
    distanceEndPoint,
    distanceUnit,
    angleUnit,
    vectorSource: measureLineSource,
    setDistanceStartPoint,
    setDistanceEndPoint,
    onResult: (distance, azimuth) => {
      setCalculatedDistance(distance);
      setCalculatedAzimuth(azimuth);
    },
  });

  // hook pro měření úhlu
  useMeasureAngle({
    mapInstance,
    active: activeTool === 'measureAngle',
    anglePointA,
    anglePointB, 
    anglePointC, 
    angleUnit, 
    vectorSource: measureAngleSource, 
    setAnglePointA,
    setAnglePointB, 
    setAnglePointC, 
    onResult: (angle) => {
      setCalculatedAngle(angle);
    },
  });

  return (
    <HomeContainer>
      <ToolBar
        distanceStartPoint={distanceStartPoint}
        distanceEndPoint={distanceEndPoint}
        setDistanceStartPoint={setDistanceStartPoint}
        setDistanceEndPoint={setDistanceEndPoint}
        anglePointA={anglePointA}
        setAnglePointA={setAnglePointA}
        anglePointB={anglePointB}
        setAnglePointB={setAnglePointB}
        anglePointC={anglePointC}
        setAnglePointC={setAnglePointC}
        calculatedDistance={calculatedDistance}
        calculatedAzimuth={calculatedAzimuth}
        calculatedAngle={calculatedAngle}
        polylinePoints={polylinePoints}
        polylineSegments={polylineSegments} 
        addPolylinePoint={addPolylinePoint}
        updatePolylinePoint={updatePolylinePoint}
        setPolylinePoints={setPolylinePoints}
        onEditPolylineSegment={setHighlightedPolylineSegmentIndex}
      />
      <MapContainer ref={mapRef} />
    </HomeContainer>
  );
};

export default Home;