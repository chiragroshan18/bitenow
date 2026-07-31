/**
 * Converts a plain-text address into { latitude, longitude } using
 * OpenStreetMap's free Nominatim API. No API key required.
 * Usage policy: max 1 request/second, must set a User-Agent.
 * https://operations.osmfoundation.org/policies/nominatim/
 *
 * Enhanced to handle complex postal addresses with fallback attempts.
 */
const geocodeAddress = async (address) => {
  // Helper function to make the actual API call
  const callNominatim = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'food-delivery-app-dev (learning project)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const results = await response.json();
    if (!results || results.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(results[0].lat),
      longitude: parseFloat(results[0].lon),
    };
  };

  // 1. Try with the full, original address first
  let result = await callNominatim(address);

  // 2. If that fails, try cleaning the address (remove "Postmaster", "Post Office", etc.)
  if (!result) {
    const cleanAddress = address
      .replace(/Postmaster,/g, '')
      .replace(/Post Office/g, '')
      .replace(/H\.O\./g, '')
      .replace(/\(H\.O\.\)/g, '')
      .replace(/ - \d{6}/g, '') // Remove pin code
      .replace(/\./g, '')
      .trim();
    if (cleanAddress.length > 10) {
      result = await callNominatim(cleanAddress);
    }
  }

  // 3. If still failing, try with just the city and state
  if (!result) {
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      // Take the last two meaningful parts (e.g., "Arakkonam, Ranipet District")
      const cityState = parts.slice(-2).join(', ');
      result = await callNominatim(cityState);
    }
  }

  // 4. If all fails, return null (the address will be saved without coordinates)
  if (!result) {
    return { latitude: null, longitude: null };
  }

  return result;
};

module.exports = { geocodeAddress };