import { useState, useEffect, useRef } from "react";
import type { Location } from '../types/types';

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: Location[];
  onSelect: (loc: Location) => void;
  onFetchOptions: (keyword: string) => void;
  selectedCode: string;
  setSelectedCode: (code: string) => void;
}

export default function AutocompleteInput({
  placeholder,
  value,
  onChange,
  options,
  onSelect,
  onFetchOptions,
  selectedCode,
  setSelectedCode,
}: AutocompleteInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length < 2) {
      setSelectedCode("");
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onFetchOptions(value);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [value, setSelectedCode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onChange(selectedCode ? value : "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCode, onChange, value]);

  return (
    <div ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSelectedCode("");
        }}
        className="border p-2 w-full mb-2 rounded"
        autoComplete="off"
      />
      {options.length > 0 && !selectedCode && (
        <ul className="absolute bg-white border w-full max-h-48 overflow-auto z-10">
          {options.map((loc) => (
            <li
              key={loc.id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onSelect(loc);
              }}
            >
              {loc.name}, {loc.address.cityName}, {loc.address.countryName} —{" "}
              <strong>{loc.iataCode}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
