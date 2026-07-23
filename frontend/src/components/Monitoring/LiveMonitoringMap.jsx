import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_TOURIST_REGION } from "../../constants/monitoringRegions";

function createTouristIcon(riskLevel, onlineStatus) {
  const riskColors = {
    low: "#16a34a",
    medium: "#d97706",
    high: "#dc2626",
  };

  const markerColor = riskColors[riskLevel] || "#2563eb";
  const ringColor = onlineStatus === "online" ? "#22c55e" : "#94a3b8";

  return L.divIcon({
    className: "tourist-marker-wrapper",
    html: `
      <div class="tourist-marker" style="--marker-color:${markerColor};--ring-color:${ringColor};">
        <span class="tourist-marker__pulse"></span>
        <span class="tourist-marker__icon">👤</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function createBoundaryZone(focusRegion) {
  if (!focusRegion?.boundary?.length) {
    return null;
  }

  return {
    _id: `${focusRegion.id}-boundary`,
    name: `${focusRegion.name} Protected Boundary`,
    description: `Operational boundary for ${focusRegion.name}. Tourists leaving this perimeter should be treated as outside the safe coverage area.`,
    zoneType: "safe",
    riskLevel: "low",
    polygon: {
      coordinates: [focusRegion.boundary.map(([lat, lng]) => [lng, lat])],
    },
  };
}

function createPresetRiskZones(focusRegion) {
  return (focusRegion?.riskZones || []).map((zone) => ({
    _id: zone.id,
    name: zone.name,
    description: `${zone.type} area for ${focusRegion.name}`,
    zoneType: zone.type,
    riskLevel: zone.riskLevel,
    polygon: {
      coordinates: [zone.coordinates.map(([lat, lng]) => [lng, lat])],
    },
  }));
}

function createRegionCenterIcon(regionName) {
  return L.divIcon({
    className: "tourist-marker-wrapper",
    html: `
      <div class="region-anchor-marker">
        <span class="region-anchor-marker__pin">📍</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 24],
    popupAnchor: [0, -24],
  });
}

function MapViewport({ focusRegion }) {
  const map = useMap();

  useEffect(() => {
    const boundary = focusRegion?.boundary || [];

    if (boundary.length > 0) {
      map.fitBounds(boundary, { padding: [28, 28] });
    } else {
      map.setView(focusRegion?.center || DEFAULT_TOURIST_REGION.center, focusRegion?.zoom || DEFAULT_TOURIST_REGION.zoom);
    }
  }, [map, focusRegion]);

  return null;
}

function LiveMonitoringMap({ tourists, zones, focusRegion }) {
  const [tileError, setTileError] = useState(false);

  const normalizedTourists = useMemo(
    () =>
      tourists.map((tourist) => {
        const [lng, lat] = tourist?.currentLocation?.coordinates || [];
        const hasLiveLocation = Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
        return hasLiveLocation ? {
          ...tourist,
          currentLocation: {
            ...(tourist.currentLocation || { type: "Point" }),
            coordinates: [lng, lat],
          },
          hasLiveLocation: true,
        } : null;
      }).filter(Boolean),
    [tourists]
  );

  const normalizedZones = useMemo(
    () =>
      [createBoundaryZone(focusRegion), ...createPresetRiskZones(focusRegion), ...zones]
        .filter(Boolean)
        .filter((zone) => {
          const ring = zone?.polygon?.coordinates?.[0] || [];
          return ring.length >= 3;
        }),
    [focusRegion, zones]
  );

  return (
    <div className="relative h-[26rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <MapContainer center={focusRegion?.center || DEFAULT_TOURIST_REGION.center} zoom={focusRegion?.zoom || DEFAULT_TOURIST_REGION.zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => setTileError(true),
            load: () => setTileError(false),
          }}
        />

        {normalizedZones.map((zone) => {
          const positions = (zone.polygon.coordinates[0] || []).map(([lng, lat]) => [lat, lng]);
          const polygonColor =
            zone.zoneType === "safe" ? "#0f766e" : zone.zoneType === "sensitive" ? "#d97706" : "#dc2626";

          return (
            <Polygon
              key={zone._id}
              positions={positions}
              pathOptions={{
                color: polygonColor,
                weight: 3,
                fillColor: polygonColor,
                fillOpacity: 0.18,
              }}
            >
              <Tooltip sticky>{zone.name}</Tooltip>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-800">{zone.name}</p>
                  <p className="text-slate-600">{zone.description || "No description provided."}</p>
                  <p className="text-slate-600">Type: {zone.zoneType}</p>
                  <p className="text-slate-600">Risk: {zone.riskLevel}</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {focusRegion?.center ? (
          <Marker position={focusRegion.center} icon={createRegionCenterIcon(focusRegion.name)}>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-800">{focusRegion.name}</p>
                <p className="text-slate-600">{focusRegion.subtitle}</p>
                <p className="text-slate-600">Map focus region and search anchor.</p>
              </div>
            </Popup>
          </Marker>
        ) : null}

        {normalizedTourists.map((tourist) => {
          const [lng, lat] = tourist.currentLocation.coordinates;

          return (
            <Marker
              key={tourist._id}
              position={[lat, lng]}
              icon={createTouristIcon(tourist.riskLevel, tourist.onlineStatus)}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-800">{tourist.fullName}</p>
                  <p className="text-slate-600">Status: {tourist.onlineStatus}</p>
                  <p className="text-slate-600">Zone status: {tourist.zoneStatus}</p>
                  <p className="text-slate-600">Risk: {tourist.riskLevel}</p>
                  <p className="text-slate-600">Speed: {Number(tourist.lastSpeedKmh || 0).toFixed(1)} km/h</p>
                  <p className="text-slate-600">Lat: {lat.toFixed(6)}</p>
                  <p className="text-slate-600">Lng: {lng.toFixed(6)}</p>
                  <p className="text-slate-600">
                    Source: {tourist.lastLocationSource || "Device GPS update"}
                  </p>
                  <p className="text-slate-600">
                    Last seen: {tourist.lastSeen ? new Date(tourist.lastSeen).toLocaleTimeString() : "No signal"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapViewport focusRegion={focusRegion} />
      </MapContainer>

      {tileError ? (
        <div className="pointer-events-none absolute inset-x-4 top-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 shadow-sm">
          Map tiles could not be loaded. Tourist coordinates and zone overlays are still active when the tile server becomes reachable.
        </div>
      ) : null}

      {!normalizedTourists.length && !normalizedZones.length ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/75 text-sm text-slate-500">
          No device-reported tourist coordinates or active zones are available yet.
        </div>
      ) : null}
    </div>
  );
}

export default LiveMonitoringMap;
