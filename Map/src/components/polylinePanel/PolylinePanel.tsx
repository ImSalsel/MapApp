import React, { useEffect, useMemo, useState } from "react";
import {
  PanelContainer,
  InputLabel,
  PointInputGroup,
  InputField,
  SegmentRow,
  ToolButton,
  CalculatedValue,
  TrashIcon,
  LabelRow,
} from "../toolBar/styled";
import type { PointCoordinates } from "../../pages/home/types";
import {
  getDistance,
  getAzimuth,
  destinationPoint,
} from "../../utils/geometryUtils";
import { EditIconStyled, SegmentsContainer } from "./styled";

// komponent pro ikonu upravit
const EditIcon = ({ onClick }: { onClick: () => void }) => (
  <EditIconStyled title="Upravit" onClick={onClick}>
    ✏️
  </EditIconStyled>
);

interface PolylinePanelProps {
  points: PointCoordinates[];
  segments: { start: PointCoordinates; end: PointCoordinates }[];
  onPointChange: (idx: number, coords: PointCoordinates) => void;
  onAddPoint: (coords: PointCoordinates) => void;
  onRemove: () => void;
  distanceUnit: "km" | "mi";
  angleUnit: "deg" | "rad";
  onEditSegment: (index: number | null) => void;
}

// pokud se reference na propsy nezmění, komponent se nepřerenderuje
const PolylinePanel: React.FC<PolylinePanelProps> = React.memo(
  ({
    points,
    segments,
    onPointChange,
    onAddPoint,
    distanceUnit,
    angleUnit,
    onRemove,
    onEditSegment,
  }) => {

    // stav pro sledování, který segment je právě upravován
    const [editingIdx, setEditingId] = useState<number | null>(null);
    // stav pro nový bod, který se přidává přes input
    const [newPoint, setNewPoint] = useState<{ lon: string; lat: string }>({
      lon: "",
      lat: "",
    });

    // stav pro délku a azimut nového segmentu přes input
    const [newLength, setNewLength] = useState("");
    const [newAzimuth, setNewAzimuth] = useState("");

    // efekt pro volání callbacku při změně editingIdx pro highlighting segmentu
    useEffect(() => {
      onEditSegment(editingIdx);
    }, [editingIdx, onEditSegment]);

    // funkce pro nastavení/zrušení editace segmentu
    const handleSetEditingIdx = (id: number | null) => {
      setEditingId((currentId) => (currentId === id ? null : id));
    };

    // vypočet celkové délky polyčáry, přepočítává se pouze pokud se změní segmenty nebo jednotka vzdálenosti
    const totalLength = useMemo(() => {
      console.log("Calculating totalLength for polyline");
      return segments.reduce((sum, seg) => {
        if (
          seg.start &&
          seg.start.lon &&
          seg.start.lat &&
          seg.end &&
          seg.end.lon &&
          seg.end.lat
        ) {
          const len = parseFloat(
            getDistance(
              [parseFloat(seg.start.lon), parseFloat(seg.start.lat)],
              [parseFloat(seg.end.lon), parseFloat(seg.end.lat)],
              distanceUnit
            )
          );
          // ignor NaN hodnot
          return sum + (isNaN(len) ? 0 : len);
        }
        return sum;
      }, 0);
    }, [segments, distanceUnit]);

    // funkce pro přidání bodu podle délky a azimutu
    const handleAddByLengthAzimuth = () => {
      if (
        points.length === 0 ||
        !newLength ||
        !newAzimuth ||
        isNaN(Number(newLength)) ||
        isNaN(Number(newAzimuth))
      )
        return;
      const last = points[points.length - 1];
      if (!last.lon || !last.lat) return;
      const next = destinationPoint(
        last,
        Number(newLength),
        Number(newAzimuth),
        distanceUnit,
        angleUnit
      );
      onAddPoint(next);
      setNewLength("");
      setNewAzimuth("");
    };

    return (
      <PanelContainer>
        <LabelRow>
          <InputLabel>Segmenty polyčáry:</InputLabel>
          <TrashIcon title="Vymazat měření" onClick={onRemove}>
            🗑️
          </TrashIcon>
        </LabelRow>
        <SegmentsContainer>
          {segments.map((seg, id) => (
            <React.Fragment key={id}>
              <SegmentRow>
                <div>{id + 1}:</div>
                <div>
                  Délka:{" "}
                  {getDistance(
                    [parseFloat(seg.start.lon), parseFloat(seg.start.lat)],
                    [parseFloat(seg.end.lon), parseFloat(seg.end.lat)],
                    distanceUnit
                  )}
                </div>
                <div>
                  Azimut:{" "}
                  {getAzimuth(
                    [parseFloat(seg.start.lon), parseFloat(seg.start.lat)],
                    [parseFloat(seg.end.lon), parseFloat(seg.end.lat)],
                    angleUnit
                  )}
                </div>
                <EditIcon
                  onClick={() =>
                    handleSetEditingIdx(editingIdx === id ? null : id)
                  }
                />
              </SegmentRow>
              {editingIdx === id && (
                <div
                  style={{
                    padding: "8px 0 8px 32px",
                    background: "#f5f5f5",
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontSize: "0.95em", marginBottom: 4 }}>
                    Úprava segmentu {id + 1}
                  </div>
                  <PointInputGroup>
                    <InputField
                      type="number"
                      step="0.1"
                      placeholder="Start Lon"
                      value={Number(seg.start.lon).toFixed(3)}
                      onChange={(e) =>
                        onPointChange(id, { ...seg.start, lon: e.target.value })
                      }
                    />
                    <InputField
                      type="number"
                      step="0.1"
                      placeholder="Start Lat"
                      value={Number(seg.start.lat).toFixed(3)}
                      onChange={(e) =>
                        onPointChange(id, { ...seg.start, lat: e.target.value })
                      }
                    />
                  </PointInputGroup>
                  <PointInputGroup>
                    <InputField
                      type="number"
                      step="0.1"
                      placeholder="End Lon"
                      value={Number(seg.end.lon).toFixed(3)}
                      onChange={(e) =>
                        onPointChange(id + 1, {
                          ...seg.end,
                          lon: e.target.value,
                        })
                      }
                    />
                    <InputField
                      type="number"
                      step="0.1"
                      placeholder="End Lat"
                      value={Number(seg.end.lat).toFixed(3)}
                      onChange={(e) =>
                        onPointChange(id + 1, {
                          ...seg.end,
                          lat: e.target.value,
                        })
                      }
                    />
                  </PointInputGroup>
                </div>
              )}
            </React.Fragment>
          ))}
        </SegmentsContainer>

        <CalculatedValue>
          Celková délka: {totalLength.toFixed(3)} {distanceUnit}
        </CalculatedValue>

        <InputLabel>Přidat další segment:</InputLabel>
        <PointInputGroup>
          <InputField
            type="number"
            step="0.1"
            placeholder="Lon"
            value={newPoint.lon}
            onChange={(e) => setNewPoint({ ...newPoint, lon: e.target.value })}
          />
          <InputField
            type="number"
            step="0.1"
            placeholder="Lat"
            value={newPoint.lat}
            onChange={(e) => setNewPoint({ ...newPoint, lat: e.target.value })}
          />

          <ToolButton
            onClick={() => {
              if (newPoint.lon && newPoint.lat) {
                onAddPoint(newPoint);
                setNewPoint({ lon: "", lat: "" });
              }
            }}
          >
            Přidat
          </ToolButton>
        </PointInputGroup>

        <InputLabel>Přidat další bod podle délky a azimutu:</InputLabel>
        <PointInputGroup>
          <InputField
            type="number"
            step="0.1"
            placeholder={`Délka (${distanceUnit})`}
            value={newLength}
            onChange={(e) => setNewLength(e.target.value)}
          />
          <InputField
            type="number"
            step="0.1"
            placeholder={`Azimut (${angleUnit})`}
            value={newAzimuth}
            onChange={(e) => setNewAzimuth(e.target.value)}
          />
          <ToolButton onClick={handleAddByLengthAzimuth}>
            Přidat podle délky/azimutu
          </ToolButton>
        </PointInputGroup>
      </PanelContainer>
    );
  }
);

export default PolylinePanel;
