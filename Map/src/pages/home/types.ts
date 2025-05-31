export type ActiveTool = 'measureDistance' | 'measureAngle' | 'polyline' | null;

export interface PointCoordinates {
  lon: string;
  lat: string;
}
export type PolylineSegment = {
    start: PointCoordinates;
    end: PointCoordinates;
    length: string;
    azimuth: string;
  };