import { useEffect, useState } from "react";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import Modify, { ModifyEvent } from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import { fromLonLat, toLonLat } from "ol/proj";
import { calculateAngle } from "../utils/geometryUtils";
import type Map from "ol/Map";

// styly pro čáru
const styleVariables = {
  width: 4,
  offset: 0,
  capType: "butt",
  joinType: "miter",
  miterLimit: 10,
};

const getStyle = () => ({
  "stroke-width": ["var", "width"],
  "stroke-color": "rgba(60, 31, 107, 0.7)",
  "stroke-offset": ["var", "offset"],
  "stroke-miter-limit": ["var", "miterLimit"],
  "stroke-line-cap": ["var", "capType"],
  "stroke-line-join": ["var", "joinType"],
});

interface UseMeasureAngleProps {
  mapInstance: Map | null;
  active: boolean;
  anglePointA: { lon: string; lat: string };
  anglePointB: { lon: string; lat: string };
  anglePointC: { lon: string; lat: string };
  angleUnit: "deg" | "rad";
  vectorSource: VectorSource;
  setAnglePointA: (p: { lon: string; lat: string }) => void;
  setAnglePointB: (p: { lon: string; lat: string }) => void;
  setAnglePointC: (p: { lon: string; lat: string }) => void;
  onResult: (angle: string) => void;
}

// hook pro kreslení a měření úhlu mezi třemi body na mapě
export function useMeasureAngle({
  mapInstance,
  active,
  anglePointA,
  anglePointB,
  anglePointC,
  angleUnit,
  vectorSource,
  setAnglePointA,
  setAnglePointB,
  setAnglePointC,
  onResult,
}: UseMeasureAngleProps) {
  // vytvoření vrstvy
  const [vectorLayer] = useState(
    () =>
      new WebGLVectorLayer({
        source: vectorSource,
        style: getStyle(),
        variables: { ...styleVariables },
      })
  );

  // vytvoření vrstvy mapy
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.addLayer(vectorLayer);
    return () => {
      mapInstance.removeLayer(vectorLayer);
    };
  }, [mapInstance, vectorLayer]);

  // useEffect pro kreslení přes Draw
  useEffect(() => {
    if (!mapInstance || !active) return;

    const draw = new Draw({
      source: vectorSource,
      type: "LineString",
      maxPoints: 3,
      minPoints: 3,
    });

    // funkce pro zpracování konce kreslení
    const handleDrawEnd = (evt: DrawEvent) => {
      // Vymaže předchozí měření
      vectorSource.clear();

      const feature = evt.feature;
      const geometry = feature?.getGeometry();

      if (geometry instanceof LineString) {
        const coordsMapProj = geometry.getCoordinates();
        if (coordsMapProj.length === 3) {
          const p1LonLat = toLonLat(coordsMapProj[0]);
          const p2LonLat = toLonLat(coordsMapProj[1]);
          const p3LonLat = toLonLat(coordsMapProj[2]);

          // aktualizace bodů A, B, C
          setAnglePointA({
            lon: p1LonLat[0].toString(),
            lat: p1LonLat[1].toString(),
          });
          setAnglePointB({
            lon: p2LonLat[0].toString(),
            lat: p2LonLat[1].toString(),
          });
          setAnglePointC({
            lon: p3LonLat[0].toString(),
            lat: p3LonLat[1].toString(),
          });

          // výpočet úhlu
          const angle = calculateAngle(
            [p1LonLat[0], p1LonLat[1]],
            [p2LonLat[0], p2LonLat[1]],
            [p3LonLat[0], p3LonLat[1]],
            angleUnit
          );
          onResult(angle);
        }
      }
    };
    draw.on("drawend", handleDrawEnd);
    mapInstance.addInteraction(draw);

    return () => {
      mapInstance.removeInteraction(draw);
    };
  }, [
    mapInstance,
    active,
    vectorSource,
    setAnglePointA,
    setAnglePointB,
    setAnglePointC,
    angleUnit,
    onResult,
  ]);

  // useEffect modifikace čary přes Modify
  useEffect(() => {
    if (!mapInstance || !active) return;

    // zákaz vkládání dalších vrcholů
    const modify = new Modify({ source: vectorSource, insertVertexCondition: () => false });
    mapInstance.addInteraction(modify);

    modify.on(
      "modifyend",
      (evt: ModifyEvent) => {
        const features = evt.features.getArray();
        if (features.length > 0) {
          const geometry = features[0].getGeometry();
          if (geometry instanceof LineString) {
            const coordsMapProj = geometry.getCoordinates();
            if (coordsMapProj.length === 3) {
              const p1LonLat = toLonLat(coordsMapProj[0]);
              const p2LonLat = toLonLat(coordsMapProj[1]);
              const p3LonLat = toLonLat(coordsMapProj[2]);

              setAnglePointA({
                lon: p1LonLat[0].toString(),
                lat: p1LonLat[1].toString(),
              });
              setAnglePointB({
                lon: p2LonLat[0].toString(),
                lat: p2LonLat[1].toString(),
              });
              setAnglePointC({
                lon: p3LonLat[0].toString(),
                lat: p3LonLat[1].toString(),
              });

              const angle = calculateAngle(
                [p1LonLat[0], p1LonLat[1]],
                [p2LonLat[0], p2LonLat[1]],
                [p3LonLat[0], p3LonLat[1]],
                angleUnit
              );
              onResult(angle);
            }
          }
        }
      }
    );

    return () => {
      mapInstance.removeInteraction(modify);
    };
  }, [
    mapInstance,
    active,
    vectorSource,
    setAnglePointA,
    setAnglePointB,
    setAnglePointC,
    angleUnit,
    onResult,
  ]);

  // useEffect pro aktualizaci čáry přes inputy
  useEffect(() => {
    if (
      anglePointA.lon &&
      anglePointA.lat &&
      anglePointB.lon &&
      anglePointB.lat &&
      anglePointC.lon &&
      anglePointC.lat
    ) {
      vectorSource.clear();
      const p1MapCoords = fromLonLat([
        parseFloat(anglePointA.lon),
        parseFloat(anglePointA.lat),
      ]);
      const p2MapCoords = fromLonLat([
        parseFloat(anglePointB.lon),
        parseFloat(anglePointB.lat),
      ]);
      const p3MapCoords = fromLonLat([
        parseFloat(anglePointC.lon),
        parseFloat(anglePointC.lat),
      ]);

      const lineFeature = new Feature({
        geometry: new LineString([p1MapCoords, p2MapCoords, p3MapCoords]),
      });
      vectorSource.addFeature(lineFeature);

      const angle = calculateAngle(
        [parseFloat(anglePointA.lon), parseFloat(anglePointA.lat)],
        [parseFloat(anglePointB.lon), parseFloat(anglePointB.lat)],
        [parseFloat(anglePointC.lon), parseFloat(anglePointC.lat)],
        angleUnit
      );
      onResult(angle);
    }
  }, [
    anglePointA,
    anglePointB,
    anglePointC,
    vectorSource,
    angleUnit,
    onResult,
  ]);
}
