import { useEffect, useState } from 'react';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import VectorSource from 'ol/source/Vector';
import WebGLVectorLayer from 'ol/layer/WebGLVector';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { getDistanceAndAzimuth } from '../utils/geometryUtils';
import { fromLonLat, toLonLat } from 'ol/proj';
import type Map from "ol/Map";


//styl pro čáru
const styleVariables = {
  width: 4,
  offset: 0,
  capType: 'butt',
  joinType: 'miter',
  miterLimit: 10,
};

const getStyle = () => ({
  'stroke-width': ['var', 'width'],
  'stroke-color': 'rgba(155, 129, 43, 0.7)',
  'stroke-offset': ['var', 'offset'],
  'stroke-miter-limit': ['var', 'miterLimit'],
  'stroke-line-cap': ['var', 'capType'],
  'stroke-line-join': ['var', 'joinType'],
});

// hook pro kreslení měření vzdálenosti mezi dvěma body na mapě
export function useMeasureLine({
  mapInstance,
  active,
  distanceStartPoint,
  distanceEndPoint,
  distanceUnit,
  angleUnit,
  vectorSource,
  setDistanceStartPoint,
  setDistanceEndPoint,
  onResult,
}: {
  mapInstance: Map | null;
  active: boolean;
  distanceStartPoint: { lon: string; lat: string };
  distanceEndPoint: { lon: string; lat: string };
  distanceUnit: 'km' | 'mi';
  angleUnit: 'deg' | 'rad';
  vectorSource: VectorSource;
  setDistanceStartPoint: (p: { lon: string; lat: string }) => void;
  setDistanceEndPoint: (p: { lon: string; lat: string }) => void;
  onResult: (distance: string, azimuth: string) => void;
}) {
  // vytvoření vrstvy
  const [vectorLayer] = useState(() =>
    new WebGLVectorLayer({
      source: vectorSource,
      style: getStyle(),
      variables: { ...styleVariables },
    })
  );

  //useeffect pro upravu čary
  useEffect(() => {
    if (!mapInstance || !active) return;
    const modify = new Modify({ source: vectorSource });
    mapInstance.addInteraction(modify);

    // po dokončení modifikace čáry získáme souřadnice a vypočítáme vzdálenost a azimut
    modify.on('modifyend', (evt) => {
      const features = evt.features.getArray();
      if (features.length > 0) {
        const geometry = features[0].getGeometry() as LineString;
        const coords = geometry.getCoordinates();
        if (coords.length >= 2) {
          const [lon1, lat1] = toLonLat(coords[0]);
          const [lon2, lat2] = toLonLat(coords[1]);
          setDistanceStartPoint({ lon: lon1.toString(), lat: lat1.toString() });
          setDistanceEndPoint({ lon: lon2.toString(), lat: lat2.toString() });
          const { distance, azimuth } = getDistanceAndAzimuth([lon1, lat1], [lon2, lat2], distanceUnit, angleUnit);
          onResult(distance, azimuth);
        }
      }
    });

    return () => {
      mapInstance.removeInteraction(modify);
    };
  }, [mapInstance, active, vectorSource, setDistanceStartPoint, setDistanceEndPoint, onResult, distanceUnit, angleUnit]);

  // useEffect pro přidání vrstvy na mapu
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.addLayer(vectorLayer);
    return () => {
      mapInstance.removeLayer(vectorLayer);
    };
  }, [mapInstance, vectorLayer]);

  // useEffect pro kreslení čáry pres Draw
  useEffect(() => {
    if (!mapInstance || !active) return;
    const draw = new Draw({
      source: vectorSource,
      type: 'LineString',
      maxPoints: 2,
    });
    mapInstance.addInteraction(draw);

  draw.on('drawend', (evt) => {
    const feature = evt.feature;
    const geometry = feature?.getGeometry();
    const coords = (geometry as LineString)?.getCoordinates();
    if (coords && coords.length >= 2) {
      const [lon1, lat1] = toLonLat(coords[0]);
      const [lon2, lat2] = toLonLat(coords[1]);
      setDistanceStartPoint({ lon: lon1.toString(), lat: lat1.toString() });
      setDistanceEndPoint({ lon: lon2.toString(), lat: lat2.toString() });

      const { distance, azimuth } = getDistanceAndAzimuth([lon1, lat1], [lon2, lat2],distanceUnit, angleUnit);
      onResult(distance, azimuth);
    }
  });

  return () => {
    mapInstance.removeInteraction(draw);
  };
}, [mapInstance, active, vectorSource, setDistanceStartPoint, setDistanceEndPoint, onResult, distanceUnit, angleUnit]);

  // useEffect pro aktualizaci čáry přes inputy
useEffect(() => {
  if (
    distanceStartPoint.lon &&
    distanceStartPoint.lat &&
    distanceEndPoint.lon &&
    distanceEndPoint.lat
  ) {
    vectorSource.clear();
    const coords = [
      fromLonLat([parseFloat(distanceStartPoint.lon), parseFloat(distanceStartPoint.lat)]),
      fromLonLat([parseFloat(distanceEndPoint.lon), parseFloat(distanceEndPoint.lat)]),
    ];
    const feature = new Feature({
      geometry: new LineString(coords),
    });
    vectorSource.addFeature(feature);

    const { distance, azimuth } = getDistanceAndAzimuth(
      [parseFloat(distanceStartPoint.lon), parseFloat(distanceStartPoint.lat)],
      [parseFloat(distanceEndPoint.lon), parseFloat(distanceEndPoint.lat)],
      distanceUnit,
      angleUnit

    );
    onResult(distance, azimuth);
  }
}, [distanceStartPoint, distanceEndPoint, vectorSource, onResult, distanceUnit, angleUnit]);

}

