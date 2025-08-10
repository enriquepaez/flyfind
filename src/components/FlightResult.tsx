import Image from "next/image";
import { airlines } from "../data/airlines";

interface FlightResultProps {
  flight: {
    origin: string;
    destination: string;
    airline: string;
    price: number;
    currency: string;
    duration: string;
    link: string;
  };
}

export default function FlightResult({ flight }: FlightResultProps) {
  const airlineInfo = airlines[flight.airline] || { name: flight.airline };

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col space-y-3">
      <div className="text-lg font-semibold text-gray-700">
        <span className="font-bold">Origen:</span> {flight.origin}
      </div>
      <div className="text-lg font-semibold text-gray-700">
        <span className="font-bold">Destino:</span> {flight.destination}
      </div>

      <div className="flex items-center space-x-4">
        {airlineInfo.logoUrl && (
          <Image
            src="/logos/air-europa.svg"
            alt="Air Europa logo"
            width={100}
            height={50}
          />
        )}
        <div className="text-2xl font-extrabold text-blue-700">
          {airlineInfo.name}
        </div>
      </div>

      <div className="text-xl font-semibold text-gray-800">{flight.price}€</div>

      <div className="flex items-center space-x-2 text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{formatDuration(flight.duration)}</span>
      </div>

      <a
        href={flight.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white text-center rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Reservar
      </a>
    </div>
  );

  function formatDuration(duration: string) {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (!match) return duration;
    const [, hours, minutes] = match;
    return `${hours}h ${minutes}m`;
  }
}
