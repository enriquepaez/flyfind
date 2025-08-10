export interface Address {
  cityName: string;
  countryName: string;
}

export interface Location {
  id: string;
  name: string;
  iataCode: string;
  address: Address;
}

export interface Airline {
  code: string;
  name: string;
  logoUrl?: string;
}
