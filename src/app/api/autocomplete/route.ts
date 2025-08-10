import { NextResponse } from "next/server";
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) return NextResponse.json([], { status: 400 });

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'CITY,AIRPORT',
    });

    console.log('Amadeus response data:', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Autocompelte error: ', error);
    return NextResponse.json([], { status: 500 })
  }
}