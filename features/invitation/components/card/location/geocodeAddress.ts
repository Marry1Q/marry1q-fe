export interface GeocodeResult {
  lat?: number;
  lng?: number;
}

/**
 * Geocode a road address to coordinates using Kakao Local REST API.
 * Returns empty object when key missing or errors occur, allowing caller to handle gracefully.
 */
export async function geocodeAddress(address: string, restApiKey?: string): Promise<GeocodeResult> {
  const apiKey = restApiKey || process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!apiKey) {
    return {};
  }
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      { headers: { Authorization: `KakaoAK ${apiKey}` } }
    );
    if (!res.ok) {
      return {};
    }
    const data = await res.json();
    const doc = data?.documents?.[0];
    if (!doc) return {};
    return { lat: Number(doc.y), lng: Number(doc.x) };
  } catch {
    return {};
  }
}


