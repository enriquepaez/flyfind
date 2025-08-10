"use client";
import { useState, useCallback } from "react";
import AutocompleteInput from "../components/AutocompleteInput";
import FlightResult from "../components/FlightResult";
import Spinner from "../components/Spinner";
import type { Location } from "../types/types";

export default function Page() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originOptions, setOriginOptions] = useState<Location[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<Location[]>([]);
  const [originCode, setOriginCode] = useState("");
  const [destinationCode, setDestinationCode] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(
    async (
      keyword: string,
      setOptions: React.Dispatch<React.SetStateAction<Location[]>>
    ) => {
      if (keyword.length < 2) {
        setOptions([]);
        return;
      }
      try {
        const res = await fetch(`/api/autocomplete?keyword=${keyword}`);
        const data = await res.json();
        setOptions(data);
      } catch {
        setOptions([]);
      }
    },
    []
  );

  const handleSearch = async () => {
    if (!originCode || !destinationCode) {
      alert(
        "Por favor, selecciona un aeropuerto válido para origen y destino."
      );
      return;
    }

    if (dateFrom && dateTo && new Date(dateTo) < new Date(dateFrom)) {
      alert("La fecha de regreso no puede ser anterior a la de salida.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: originCode,
          destination: destinationCode,
          dateFrom,
          dateTo,
        }),
      });
      if (!res.ok) throw new Error("Error en la búsqueda");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      alert("Error al buscar vuelos, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-blue-600 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">FlyFind ✈️</h1>

      <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow">
        <AutocompleteInput
          placeholder="Origen"
          value={origin}
          onChange={setOrigin}
          options={originOptions}
          onSelect={(loc) => {
            setOrigin(`${loc.name} (${loc.iataCode})`);
            setOriginCode(loc.iataCode);
            setOriginOptions([]);
          }}
          onFetchOptions={(keyword) => fetchOptions(keyword, setOriginOptions)}
          selectedCode={originCode}
          setSelectedCode={setOriginCode}
        />
        <AutocompleteInput
          placeholder="Destino"
          value={destination}
          onChange={setDestination}
          options={destinationOptions}
          onSelect={(loc) => {
            setDestination(`${loc.name} (${loc.iataCode})`);
            setDestinationCode(loc.iataCode);
            setDestinationOptions([]);
          }}
          onFetchOptions={(keyword) =>
            fetchOptions(keyword, setDestinationOptions)
          }
          selectedCode={destinationCode}
          setSelectedCode={setDestinationCode}
        />

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Buscar vuelos
        </button>
      </div>

      <div className="max-w-md mx-auto mt-6 space-y-4">
        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p>No se encontraron vuelos para esos criterios.</p>
        )}

        {results.map((flight, idx) => (
          <FlightResult key={idx} flight={flight} />
        ))}
      </div>
    </main>
  );
}
