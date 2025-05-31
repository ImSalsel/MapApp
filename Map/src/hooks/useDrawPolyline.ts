import { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import { fromLonLat, toLonLat } from "ol/proj";
import { calculateSegments } from "../utils/geometryUtils";
import { unByKey } from "ol/Observable";
import type { PointCoordinates } from "../pages/home/types";
import type Map from "ol/Map";
import type { EventsKey } from "ol/events";

//stylování polyline
const styleVariables = {
  width: 4,
  offset: 0,
  capType: "butt",
  joinType: "miter",
  miterLimit: 10,
};

const getStyle = () => ({
  "stroke-width": ["var", "width"],
  "stroke-color": "rgba(24,86,34,0.7)",
  "stroke-offset": ["var", "offset"],
  "stroke-miter-limit": ["var", "miterLimit"],
  "stroke-line-cap": ["var", "capType"],
  "stroke-line-join": ["var", "joinType"],
});

// stylování zvýrazněných segmentů
const highlightVariables = {
  width: 7,
  offset: 0,
  capType: "round",
  joinType: "round",
  miterLimit: 10,
};
const getHighlighteStyle = () => ({
  "stroke-width": ["var", "width"],
  "stroke-color": "rgba(255, 0, 0, 0.8)",
  "stroke-offset": ["var", "offset"],
  "stroke-miter-limit": ["var", "miterLimit"],
  "stroke-line-cap": ["var", "capType"],
  "stroke-line-join": ["var", "joinType"],
  "z-index": 10,
});

export interface UseDrawPolylineProps {
  mapInstance: Map | null;
  active: boolean;
  points: { lon: string; lat: string }[];
  setPoints: (pts: { lon: string; lat: string }[]) => void;
  distanceUnit: "km" | "mi";
  angleUnit: "deg" | "rad";
  vectorSource: VectorSource;
  onSegmentsChange: (
    segments: {
      start: PointCoordinates;
      end: PointCoordinates;
      length: string;
      azimuth: string;
    }[]
  ) => void;
  highlightedSegmentIndex: number | null;
}

// hook pro kreslení polylines
export function useDrawPolyline({
  mapInstance,
  active,
  points,
  setPoints,
  distanceUnit,
  angleUnit,
  onSegmentsChange,
  vectorSource,
  highlightedSegmentIndex,
}: UseDrawPolylineProps) {
  // vytvoření vrstvy pro polyline
  const [vectorLayer] = useState(
    () =>
      new WebGLVectorLayer({
        source: vectorSource,
        style: getStyle(),
        variables: { ...styleVariables },
      })
  );

  // vytvoření zdroje a vrstvy pro zvýraznění segmentů
  const highlightVectorSourceRef = useRef(new VectorSource());
  const [highlightVectorLayer] = useState(
    () =>
      new WebGLVectorLayer({
        source: highlightVectorSourceRef.current,
        style: getHighlighteStyle(),
        variables: { ...highlightVariables },
      })
  );

  // useEffect pro přidání a odebrání vrstev z mapy
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.addLayer(vectorLayer);
    mapInstance.addLayer(highlightVectorLayer);
    return () => {
      mapInstance.removeLayer(vectorLayer);
      mapInstance.removeLayer(highlightVectorLayer);
    };
  }, [highlightVectorLayer, mapInstance, vectorLayer]);

  //useeffect pro kreslení polylines
  useEffect(() => {
    if (!mapInstance || !active) return;

    const draw = new Draw({
      source: vectorSource,
      type: "LineString",
    });
    mapInstance.addInteraction(draw);

    let drawingFeature: Feature<LineString> | null = null;
    let geometryChangeListenerKey: EventsKey | null = null;

    // funkce pro zpracování přidávání jednolivých bodů do polyline
    const handleGeometryChange = () => {
      if (!drawingFeature) return;
      const geometry = drawingFeature.getGeometry();
      if (geometry) {
        const coords = geometry.getCoordinates();
        if (coords.length < 2) {
          onSegmentsChange([]);
          return;
        }

        // převod souřadnic na lon/lat a volání funkce pro výpočet segmentu
        const currentPoints = coords.map((c) => {
          const [lon, lat] = toLonLat(c);
          return { lon: lon.toString(), lat: lat.toString() };
        });
        onSegmentsChange(
          calculateSegments(currentPoints, distanceUnit, angleUnit)
        );
      }
    };

    // event při začátku kreslení
    draw.on("drawstart", (evt) => {
      drawingFeature = evt.feature as Feature<LineString>;
      const geometry = drawingFeature.getGeometry();
      if (geometry) {
        // při změně geometrie pro dynamické aktualizace segmentů
        geometryChangeListenerKey = geometry.on("change", handleGeometryChange);
      }
      onSegmentsChange([]);
    });

    //event při konci kreslení
    draw.on("drawend", (evt) => {
      const geometry = evt.feature.getGeometry() as LineString;
      const coords = geometry.getCoordinates();
      const newPoints = coords.map((c) => {
        const [lon, lat] = toLonLat(c);
        return { lon: lon.toString(), lat: lat.toString() };
      });
      setPoints(newPoints);

      //odstranění lieteneru pro změnu geometrie
      if (geometryChangeListenerKey) {
        unByKey(geometryChangeListenerKey);
      }
      drawingFeature = null;
      geometryChangeListenerKey = null;
    });

    return () => {
      mapInstance.removeInteraction(draw);
      if (geometryChangeListenerKey) {
        unByKey(geometryChangeListenerKey);
      }
      drawingFeature = null;
      geometryChangeListenerKey = null;
    };
  }, [
    mapInstance,
    active,
    vectorSource,
    distanceUnit,
    angleUnit,
    onSegmentsChange,
    setPoints,
  ]);

  // useEffect pro modifikaci existujících polylines
  useEffect(() => {
    if (!mapInstance || !active) return;

    // vytvoření Modify interakce a přidání do mapy
    const modify = new Modify({ source: vectorSource });
    mapInstance.addInteraction(modify);

    modify.on("modifyend", () => {
      const features = vectorSource.getFeatures();
      if (features.length > 0) {
        const geometry = features[0].getGeometry() as LineString;
        const coords = geometry.getCoordinates();

        // převod souřadnic na lon/lat a aktualizace stavů
        const newPoints = coords.map((c) => {
          const [lon, lat] = toLonLat(c);
          return { lon: lon.toString(), lat: lat.toString() };
        });
        setPoints(newPoints);
      }
    });

    return () => {
      mapInstance.removeInteraction(modify);
    };
  }, [mapInstance, active, setPoints, vectorSource]);

  // useEffect pro kreslení aktualizace polyline přes inputy
  useEffect(() => {
    vectorSource.clear();

    // filtr platných bodů
    const validPoints = points.filter(
      (pt) =>
        pt.lon !== "" &&
        pt.lat !== "" &&
        !isNaN(parseFloat(pt.lon)) &&
        !isNaN(parseFloat(pt.lat))
    );
    if (validPoints.length >= 2) {
      // transformace souřadnic z lon/lat na mapové souřadnice
      const coords = validPoints.map((pt) =>
        fromLonLat([parseFloat(pt.lon), parseFloat(pt.lat)])
      );
      // vytvoření nové čáry a přidání do zdroje
      const feature = new Feature({
        geometry: new LineString(coords),
      });
      vectorSource.addFeature(feature);
    }
    // přepočet a aktualizace segmentů 
    onSegmentsChange(calculateSegments(validPoints, distanceUnit, angleUnit));
  }, [points, vectorSource, distanceUnit, angleUnit, onSegmentsChange]);

  // useEffect pro zvýraznění segmentu polyline
  useEffect(() => {
    highlightVectorSourceRef.current.clear();
    //kontrola, zda je zvýrazněný segment platný
    if (
      highlightedSegmentIndex !== null &&
      points.length > highlightedSegmentIndex + 1
    ) {
      const p1 = points[highlightedSegmentIndex];
      const p2 = points[highlightedSegmentIndex + 1];

      if (
        p1 &&
        p1.lon &&
        p1.lat &&
        p2 &&
        p2.lon &&
        p2.lat &&
        !isNaN(parseFloat(p1.lon)) &&
        !isNaN(parseFloat(p1.lat)) &&
        !isNaN(parseFloat(p2.lon)) &&
        !isNaN(parseFloat(p2.lat))
      ) {

        // transformace souřadnic z lon/lat na mapové souřadnice
        const segmentCoords = [
          fromLonLat([parseFloat(p1.lon), parseFloat(p1.lat)]),
          fromLonLat([parseFloat(p2.lon), parseFloat(p2.lat)]),
        ];
        // vytvoření zvýraznění
        const highlightFeature = new Feature({
          geometry: new LineString(segmentCoords),
        });
        highlightVectorSourceRef.current.addFeature(highlightFeature);
      }
    }
  }, [points, highlightedSegmentIndex, distanceUnit, angleUnit]);
}
