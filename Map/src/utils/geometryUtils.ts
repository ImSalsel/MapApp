import { getDistance as geolibGetDistance, getGreatCircleBearing, computeDestinationPoint } from 'geolib';
import type { PointCoordinates } from '../pages/home/types';

// util funkce pro výpočet zdálenosti mezi dvěma body
export function getDistance(coord1: number[], coord2: number[], distanceUnit: 'km' | 'mi'): string {
  // vypočet vzdálenosti v metrech 
  const distanceMeters = geolibGetDistance(
    { latitude: coord1[1], longitude: coord1[0] },
    { latitude: coord2[1], longitude: coord2[0] }
  );
  
  // převod na požadovanou jednotku
    if (distanceUnit === 'mi') {
    const distanceMi = distanceMeters / 1609.344;
    return distanceMi.toFixed(3) + ' mi';
  } else {
    const distanceKm = distanceMeters / 1000;
    return distanceKm.toFixed(3) + ' km';
  }
}

// util funkce pro výpočet azimutu mezi dvěma body
export function getAzimuth(coord1: number[], coord2: number[], angleUnit: 'deg' | 'rad'): string {
  // vypočet azimutu v stupních
  const bearingDeg = getGreatCircleBearing(
    { latitude: coord1[1], longitude: coord1[0] },
    { latitude: coord2[1], longitude: coord2[0] }
  );
  // převod na požadovanou jednotku
    if (angleUnit === 'rad') {
    const bearingRad = (bearingDeg * Math.PI) / 180;
    return bearingRad.toFixed(4) + ' rad';
  } else {
    return bearingDeg.toFixed(2) + '°';
  }
}

// util funkce pro výpočet úhlu mezi třemi body
export function calculateAngle(
  a: number[],
  b: number[],
  c: number[],
  unit: 'deg' | 'rad'
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const ax = toRad(a[0]);
  const ay = toRad(a[1]);
  const bx = toRad(b[0]);
  const by = toRad(b[1]);
  const cx = toRad(c[0]);
  const cy = toRad(c[1]);

  const vBA = [ax - bx, ay - by];
  const vBC = [cx - bx, cy - by];

  const dot = vBA[0] * vBC[0] + vBA[1] * vBC[1];
  const magBA = Math.sqrt(vBA[0] ** 2 + vBA[1] ** 2);
  const magBC = Math.sqrt(vBC[0] ** 2 + vBC[1] ** 2);

  let angleRad = Math.acos(dot / (magBA * magBC));
  if (isNaN(angleRad)) angleRad = 0;

  if (unit === 'deg') {
    return (angleRad * 180 / Math.PI).toFixed(2) + '°';
  } else {
    return angleRad.toFixed(4) + ' rad';
  }
}

// util funkce pro výpočet délky a azimutu segmentu
export function calculateSegments(
  points: { lon: string; lat: string }[],
  distanceUnit: 'km' | 'mi',
  angleUnit: 'deg' | 'rad'
) {
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    if (
      start && end &&
      start.lon && start.lat && end.lon && end.lat &&
      !isNaN(parseFloat(start.lon)) && !isNaN(parseFloat(start.lat)) &&
      !isNaN(parseFloat(end.lon)) && !isNaN(parseFloat(end.lat))
    ) {
      segments.push({
        start,
        end,
        length: getDistance(
          [parseFloat(start.lon), parseFloat(start.lat)],
          [parseFloat(end.lon), parseFloat(end.lat)],
          distanceUnit
        ),
        azimuth: getAzimuth(
          [parseFloat(start.lon), parseFloat(start.lat)],
          [parseFloat(end.lon), parseFloat(end.lat)],
          angleUnit
        ),
      });
    }
  }
  return segments;
}

// util funkce pro výpočet cílového bodu na základě počátečního bodu, vzdálenosti a azimutu
export function destinationPoint(
  start: PointCoordinates,
  distance: number,
  azimuth: number,
  distanceUnit: 'km' | 'mi' ,
  angleUnit: 'deg' | 'rad' 
): PointCoordinates {

  let distanceMeters = distance;
  if (distanceUnit === 'km') distanceMeters = distance * 1000;
  if (distanceUnit === 'mi') distanceMeters = distance * 1609.344;

  let azimuthDeg = azimuth;
  if (angleUnit === 'rad') azimuthDeg = (azimuth * 180) / Math.PI;

  const result = computeDestinationPoint(
    {
      latitude: parseFloat(start.lat),
      longitude: parseFloat(start.lon),
    },
    distanceMeters,
    azimuthDeg
  );

  return {
    lon: result.longitude.toString(),
    lat: result.latitude.toString(),
  };
}

// kombinovaná helper funkce pro získání vzdálenosti a azimutu mezi dvěma body
export function getDistanceAndAzimuth(coord1: number[], coord2: number[], distanceUnit: 'km' | 'mi', angleUnit: 'deg' | 'rad') {
  console.log('Calculating distance and azimuth for:', coord1, coord2);
  const distance = getDistance(coord1, coord2, distanceUnit);
  const azimuth = getAzimuth(coord1, coord2, angleUnit);
  return { distance, azimuth };
}