import { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import PageShell from "../../components/common/PageShell";
import { DEPLOYMENT_AREA } from "../../constants";
import LiveMonitoringMap from "../../components/Monitoring/LiveMonitoringMap";
import { getLiveTourists, getMonitoringStats, getZones } from "../../services/monitoringService";
import { DEFAULT_TOURIST_REGION, TOURIST_REGION_PRESETS } from "../../constants/monitoringRegions";

function MonitoringPage() {
  const [tourists, setTourists] = useState([]);
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState(DEFAULT_TOURIST_REGION.name);
  const [focusRegion, setFocusRegion] = useState(DEFAULT_TOURIST_REGION);
  const [stats, setStats] = useState({
    plannedMarkerPoints: 0,
    sensitiveRouteSegments: 0,
    geoFenceRulesPlanned: 0,
  });
  const [mapMessage, setMapMessage] = useState("");

  const regionSuggestions = useMemo(
    () => TOURIST_REGION_PRESETS.map((region) => region.name),
    []
  );

  const handleRegionSearch = (event) => {
    event.preventDefault();
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchedRegion = TOURIST_REGION_PRESETS.find((region) => {
      const label = `${region.name} ${region.subtitle}`.toLowerCase();
      return label.includes(normalizedSearch);
    });

    if (matchedRegion) {
      setFocusRegion(matchedRegion);
      setMapMessage("");
      return;
    }

    setMapMessage("Place not found in the curated tourist-region list. Try Hampi, Mysuru Palace, or Old Goa.");
  };

  useEffect(() => {
    let isMounted = true;

    const loadMonitoringData = async () => {
      try {
        const [touristsResponse, zonesResponse, statsResponse] = await Promise.all([
          getLiveTourists(),
          getZones(),
          getMonitoringStats(),
        ]);

        if (!isMounted) {
          return;
        }

        const liveTourists = Array.isArray(touristsResponse.data) ? touristsResponse.data : [];

        const activeZones = Array.isArray(zonesResponse.data) ? zonesResponse.data : [];
        const liveStats = statsResponse.data || {};

        setTourists(liveTourists);
        setZones(activeZones);
        setStats({
          plannedMarkerPoints: liveStats.plannedMarkerPoints ?? activeZones.length,
          sensitiveRouteSegments: liveStats.sensitiveRouteSegments ?? 0,
          geoFenceRulesPlanned: liveStats.geoFenceRulesPlanned ?? activeZones.length,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMapMessage(error.response?.data?.message || "Unable to load live monitoring data.");
      }
    };

    loadMonitoringData();
    const intervalId = window.setInterval(loadMonitoringData, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <PageShell title="Area Monitoring" subtitle={`Watch movement, marker planning, and future geo-fence readiness inside ${DEPLOYMENT_AREA}.`}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <FaMapMarkerAlt />
              <span className="font-semibold">Marker planning map</span>
            </div>
            <form onSubmit={handleRegionSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="relative block">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  list="tourist-region-suggestions"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-sky-500 sm:w-72"
                  placeholder="Search tourist place like Hampi"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <datalist id="tourist-region-suggestions">
                  {regionSuggestions.map((regionName) => (
                    <option key={regionName} value={regionName} />
                  ))}
                </datalist>
              </label>
              <button type="submit" className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700">
                Focus Region
              </button>
            </form>
          </div>
          <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Focused region: <span className="font-semibold">{focusRegion.name}</span> ({focusRegion.subtitle})
          </div>
          <LiveMonitoringMap tourists={tourists} zones={zones} focusRegion={focusRegion} />
          {mapMessage ? <p className="mt-3 text-sm text-rose-600">{mapMessage}</p> : null}
        </div>
        <div className="space-y-3">
          {[
            { label: "Planned marker points", value: String(stats.plannedMarkerPoints) },
            { label: "Sensitive route segments", value: String(stats.sensitiveRouteSegments) },
            { label: "Geo-fence rules planned", value: String(stats.geoFenceRulesPlanned) },
            { label: "Tourists reporting a device location", value: String(tourists.filter((tourist) => {
              const [lng, lat] = tourist?.currentLocation?.coordinates || [];
              return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
            }).length) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Phase 1", detail: "Single-area registration and control dashboard" },
          { title: "Phase 2", detail: "Map markers, geo-fence boundaries, and mobile app onboarding" },
          { title: "Phase 3", detail: "AI prediction using movement, alerts, and zone risk parameters" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">{item.title}</p>
            <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export default MonitoringPage;
