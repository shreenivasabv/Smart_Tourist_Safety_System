import TouristForm from "./TouristForm";
import TouristTable from "./TouristTable";
import { useEffect, useState } from "react";
import { getAllTourists, deleteTourist } from "../../services/touristService";

function TouristsPage() {
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTourists = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllTourists();
      setTourists(Array.isArray(data.tourists) ? data.tourists : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tourists.");
      setTourists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTourists();
  }, []);

  const removeTourist = async (id) => {
    if (!window.confirm("Delete Tourist?")) return;

    try {
      await deleteTourist(id);
      await loadTourists();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete tourist.");
    }
  };

  return (
    <>
      <TouristForm onRegister={loadTourists} />
      <TouristTable
        tourists={tourists}
        onDelete={removeTourist}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default TouristsPage;
