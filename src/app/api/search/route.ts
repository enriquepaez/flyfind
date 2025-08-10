import { NextResponse } from "next/server";
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const { origin, destination, dateFrom, dateTo } = await request.json();

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: dateFrom,
      returnDate: dateTo,
      adults: '1',
    });

    const flights = response.data;

    const results = flights.map((f: any) => ({
      airline: f.validatingAirlineCodes[0],
      price: f.price.grandTotal,
      currency: f.currency,
      origin,
      destination,
      dateFrom,
      dateTo,
      duration: f.itineraries[0].duration,
      link: 'https://amadeus.com',
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error Amadeus API: ', error);
    return NextResponse.json({ error: 'Error fetching flights' }, { status: 500});
  }
}