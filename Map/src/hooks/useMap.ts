import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';

// hook pro initializaci OpenLayers mapy
export const useMap = (mapRef: React.RefObject<HTMLDivElement>) => {

  // ref pro uložení instance mapy
  const mapInstanceRef = useRef<Map | null>(null);

  // useEffect pro inicializaci mapy, pokud ještě není vytvořena
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const osmLayer = new TileLayer({ source: new OSM() });

      // vytvoření instance mapy
      const map = new Map({
        target: mapRef.current,
        layers: [osmLayer],
        view: new View({ center: [0, 0], zoom: 2, projection: 'EPSG:3857'}),
      });
      mapInstanceRef.current = map;
    }

    // cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [mapRef]);

  // hook vraci instanci mapy
  return { mapInstance: mapInstanceRef.current};
};