import axios from 'axios'

const BASE_URL = 'https://api.openaq.org/v3'
const API_KEY = import.meta.env.VITE_OPENAQ_API_KEY || ''

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  },
  timeout: 15000,
})

// Pollutant parameter IDs in OpenAQ v3
// These are standard parameter names
const POLLUTANT_PARAMS = ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co']

// Map of known city → location IDs (fallback for demo)
const CITY_LOCATION_MAP = {
  // --- INDIA ---
  'Delhi': { lat: 28.6139, lon: 77.2090, country: 'IN' },
  'Mumbai': { lat: 19.0760, lon: 72.8777, country: 'IN' },
  'Kolkata': { lat: 22.5726, lon: 88.3639, country: 'IN' },
  'Bangalore': { lat: 12.9716, lon: 77.5946, country: 'IN' },
  'Hyderabad': { lat: 17.3850, lon: 78.4867, country: 'IN' },
  'Chennai': { lat: 13.0827, lon: 80.2707, country: 'IN' },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714, country: 'IN' },
  'Pune': { lat: 18.5204, lon: 73.8567, country: 'IN' },
  'Jaipur': { lat: 26.9124, lon: 75.7873, country: 'IN' },
  'Lucknow': { lat: 26.8467, lon: 80.9462, country: 'IN' },
  'Kanpur': { lat: 26.4499, lon: 80.3319, country: 'IN' },
  'Nagpur': { lat: 21.1458, lon: 79.0882, country: 'IN' },
  'Indore': { lat: 22.7196, lon: 75.8577, country: 'IN' },
  'Bhopal': { lat: 23.2599, lon: 77.4126, country: 'IN' },
  'Patna': { lat: 25.5941, lon: 85.1376, country: 'IN' },
  'Varanasi': { lat: 25.3176, lon: 82.9739, country: 'IN' },
  'Agra': { lat: 27.1767, lon: 78.0081, country: 'IN' },
  'Surat': { lat: 21.1702, lon: 72.8311, country: 'IN' },
  'Visakhapatnam': { lat: 17.6868, lon: 83.2185, country: 'IN' },
  'Coimbatore': { lat: 11.0168, lon: 76.9558, country: 'IN' },
  'Guwahati': { lat: 26.1445, lon: 91.7362, country: 'IN' },
  'Chandigarh': { lat: 30.7333, lon: 76.7794, country: 'IN' },
  'Kochi': { lat: 9.9312, lon: 76.2673, country: 'IN' },
  'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366, country: 'IN' },
  'Amritsar': { lat: 31.6340, lon: 74.8723, country: 'IN' },
  'Ranchi': { lat: 23.3441, lon: 85.3096, country: 'IN' },
  'Jodhpur': { lat: 26.2389, lon: 73.0243, country: 'IN' },
  'Meerut': { lat: 28.9845, lon: 77.7064, country: 'IN' },
  'Faridabad': { lat: 28.4089, lon: 77.3178, country: 'IN' },
  'Ghaziabad': { lat: 28.6692, lon: 77.4538, country: 'IN' },

  // --- CHINA ---
  'Beijing': { lat: 39.9042, lon: 116.4074, country: 'CN' },
  'Shanghai': { lat: 31.2304, lon: 121.4737, country: 'CN' },
  'Guangzhou': { lat: 23.1291, lon: 113.2644, country: 'CN' },
  'Shenzhen': { lat: 22.5431, lon: 114.0579, country: 'CN' },
  'Chengdu': { lat: 30.5728, lon: 104.0668, country: 'CN' },
  'Wuhan': { lat: 30.5928, lon: 114.3055, country: 'CN' },
  'Chongqing': { lat: 29.4316, lon: 106.9123, country: 'CN' },
  'Tianjin': { lat: 39.3434, lon: 117.3616, country: 'CN' },
  'Xian': { lat: 34.3416, lon: 108.9398, country: 'CN' },
  'Hangzhou': { lat: 30.2741, lon: 120.1551, country: 'CN' },
  'Nanjing': { lat: 32.0603, lon: 118.7969, country: 'CN' },
  'Harbin': { lat: 45.8038, lon: 126.5340, country: 'CN' },
  'Shenyang': { lat: 41.8057, lon: 123.4315, country: 'CN' },
  'Zhengzhou': { lat: 34.7466, lon: 113.6253, country: 'CN' },
  'Jinan': { lat: 36.6512, lon: 117.1201, country: 'CN' },
  'Kunming': { lat: 25.0453, lon: 102.7097, country: 'CN' },

  // --- EAST & SOUTHEAST ASIA ---
  'Tokyo': { lat: 35.6762, lon: 139.6503, country: 'JP' },
  'Osaka': { lat: 34.6937, lon: 135.5023, country: 'JP' },
  'Nagoya': { lat: 35.1815, lon: 136.9066, country: 'JP' },
  'Seoul': { lat: 37.5665, lon: 126.9780, country: 'KR' },
  'Busan': { lat: 35.1796, lon: 129.0756, country: 'KR' },
  'Taipei': { lat: 25.0330, lon: 121.5654, country: 'TW' },
  'Bangkok': { lat: 13.7563, lon: 100.5018, country: 'TH' },
  'Ho Chi Minh City': { lat: 10.8231, lon: 106.6297, country: 'VN' },
  'Hanoi': { lat: 21.0285, lon: 105.8542, country: 'VN' },
  'Jakarta': { lat: -6.2088, lon: 106.8456, country: 'ID' },
  'Surabaya': { lat: -7.2575, lon: 112.7521, country: 'ID' },
  'Kuala Lumpur': { lat: 3.1390, lon: 101.6869, country: 'MY' },
  'Singapore': { lat: 1.3521, lon: 103.8198, country: 'SG' },
  'Manila': { lat: 14.5995, lon: 120.9842, country: 'PH' },
  'Yangon': { lat: 16.8661, lon: 96.1951, country: 'MM' },
  'Phnom Penh': { lat: 11.5564, lon: 104.9282, country: 'KH' },
  'Ulaanbaatar': { lat: 47.8864, lon: 106.9057, country: 'MN' },

  // --- SOUTH ASIA ---
  'Dhaka': { lat: 23.8103, lon: 90.4125, country: 'BD' },
  'Chittagong': { lat: 22.3569, lon: 91.7832, country: 'BD' },
  'Karachi': { lat: 24.8607, lon: 67.0011, country: 'PK' },
  'Lahore': { lat: 31.5204, lon: 74.3587, country: 'PK' },
  'Islamabad': { lat: 33.6844, lon: 73.0479, country: 'PK' },
  'Kathmandu': { lat: 27.7172, lon: 85.3240, country: 'NP' },
  'Colombo': { lat: 6.9271, lon: 79.8612, country: 'LK' },
  'Kabul': { lat: 34.5553, lon: 69.2075, country: 'AF' },

  // --- MIDDLE EAST ---
  'Dubai': { lat: 25.2048, lon: 55.2708, country: 'AE' },
  'Abu Dhabi': { lat: 24.4539, lon: 54.3773, country: 'AE' },
  'Riyadh': { lat: 24.7136, lon: 46.6753, country: 'SA' },
  'Jeddah': { lat: 21.5433, lon: 39.1728, country: 'SA' },
  'Tehran': { lat: 35.6892, lon: 51.3890, country: 'IR' },
  'Baghdad': { lat: 33.3152, lon: 44.3661, country: 'IQ' },
  'Ankara': { lat: 39.9334, lon: 32.8597, country: 'TR' },
  'Istanbul': { lat: 41.0082, lon: 28.9784, country: 'TR' },
  'Kuwait City': { lat: 29.3759, lon: 47.9774, country: 'KW' },
  'Doha': { lat: 25.2854, lon: 51.5310, country: 'QA' },
  'Muscat': { lat: 23.5880, lon: 58.3829, country: 'OM' },
  'Amman': { lat: 31.9454, lon: 35.9284, country: 'JO' },
  'Beirut': { lat: 33.8938, lon: 35.5018, country: 'LB' },
  'Tel Aviv': { lat: 32.0853, lon: 34.7818, country: 'IL' },

  // --- EUROPE ---
  'London': { lat: 51.5074, lon: -0.1278, country: 'GB' },
  'Paris': { lat: 48.8566, lon: 2.3522, country: 'FR' },
  'Berlin': { lat: 52.5200, lon: 13.4050, country: 'DE' },
  'Madrid': { lat: 40.4168, lon: -3.7038, country: 'ES' },
  'Barcelona': { lat: 41.3851, lon: 2.1734, country: 'ES' },
  'Rome': { lat: 41.9028, lon: 12.4964, country: 'IT' },
  'Milan': { lat: 45.4642, lon: 9.1900, country: 'IT' },
  'Amsterdam': { lat: 52.3676, lon: 4.9041, country: 'NL' },
  'Brussels': { lat: 50.8503, lon: 4.3517, country: 'BE' },
  'Vienna': { lat: 48.2082, lon: 16.3738, country: 'AT' },
  'Zurich': { lat: 47.3769, lon: 8.5417, country: 'CH' },
  'Prague': { lat: 50.0755, lon: 14.4378, country: 'CZ' },
  'Warsaw': { lat: 52.2297, lon: 21.0122, country: 'PL' },
  'Budapest': { lat: 47.4979, lon: 19.0402, country: 'HU' },
  'Bucharest': { lat: 44.4268, lon: 26.1025, country: 'RO' },
  'Athens': { lat: 37.9838, lon: 23.7275, country: 'GR' },
  'Stockholm': { lat: 59.3293, lon: 18.0686, country: 'SE' },
  'Oslo': { lat: 59.9139, lon: 10.7522, country: 'NO' },
  'Copenhagen': { lat: 55.6761, lon: 12.5683, country: 'DK' },
  'Helsinki': { lat: 60.1699, lon: 24.9384, country: 'FI' },
  'Dublin': { lat: 53.3498, lon: -6.2603, country: 'IE' },
  'Lisbon': { lat: 38.7223, lon: -9.1393, country: 'PT' },
  'Kyiv': { lat: 50.4501, lon: 30.5234, country: 'UA' },
  'Moscow': { lat: 55.7558, lon: 37.6173, country: 'RU' },
  'Saint Petersburg': { lat: 59.9311, lon: 30.3609, country: 'RU' },
  'Minsk': { lat: 53.9045, lon: 27.5615, country: 'BY' },
  'Sofia': { lat: 42.6977, lon: 23.3219, country: 'BG' },
  'Zagreb': { lat: 45.8150, lon: 15.9819, country: 'HR' },
  'Belgrade': { lat: 44.7866, lon: 20.4489, country: 'RS' },
  'Skopje': { lat: 41.9981, lon: 21.4254, country: 'MK' },
  'Sarajevo': { lat: 43.8563, lon: 18.4131, country: 'BA' },
  'Tirana': { lat: 41.3275, lon: 19.8187, country: 'AL' },
  'Tbilisi': { lat: 41.6938, lon: 44.8015, country: 'GE' },
  'Baku': { lat: 40.4093, lon: 49.8671, country: 'AZ' },
  'Yerevan': { lat: 40.1872, lon: 44.5152, country: 'AM' },

  // --- AFRICA ---
  'Cairo': { lat: 30.0444, lon: 31.2357, country: 'EG' },
  'Lagos': { lat: 6.5244, lon: 3.3792, country: 'NG' },
  'Kinshasa': { lat: -4.4419, lon: 15.2663, country: 'CD' },
  'Johannesburg': { lat: -26.2041, lon: 28.0473, country: 'ZA' },
  'Cape Town': { lat: -33.9249, lon: 18.4241, country: 'ZA' },
  'Nairobi': { lat: -1.2921, lon: 36.8219, country: 'KE' },
  'Addis Ababa': { lat: 9.0320, lon: 38.7469, country: 'ET' },
  'Accra': { lat: 5.6037, lon: -0.1870, country: 'GH' },
  'Dar es Salaam': { lat: -6.7924, lon: 39.2083, country: 'TZ' },
  'Khartoum': { lat: 15.5007, lon: 32.5599, country: 'SD' },
  'Abidjan': { lat: 5.3600, lon: -4.0083, country: 'CI' },
  'Casablanca': { lat: 33.5731, lon: -7.5898, country: 'MA' },
  'Algiers': { lat: 36.7372, lon: 3.0869, country: 'DZ' },
  'Tunis': { lat: 36.8190, lon: 10.1658, country: 'TN' },
  'Kampala': { lat: 0.3476, lon: 32.5825, country: 'UG' },
  'Dakar': { lat: 14.7167, lon: -17.4677, country: 'SN' },
  'Luanda': { lat: -8.8368, lon: 13.2343, country: 'AO' },
  'Lusaka': { lat: -15.3875, lon: 28.3228, country: 'ZM' },
  'Harare': { lat: -17.8252, lon: 31.0335, country: 'ZW' },

  // --- NORTH AMERICA ---
  'New York': { lat: 40.7128, lon: -74.0060, country: 'US' },
  'Los Angeles': { lat: 34.0522, lon: -118.2437, country: 'US' },
  'Chicago': { lat: 41.8781, lon: -87.6298, country: 'US' },
  'Houston': { lat: 29.7604, lon: -95.3698, country: 'US' },
  'Phoenix': { lat: 33.4484, lon: -112.0740, country: 'US' },
  'Philadelphia': { lat: 39.9526, lon: -75.1652, country: 'US' },
  'San Antonio': { lat: 29.4241, lon: -98.4936, country: 'US' },
  'San Diego': { lat: 32.7157, lon: -117.1611, country: 'US' },
  'Dallas': { lat: 32.7767, lon: -96.7970, country: 'US' },
  'San Francisco': { lat: 37.7749, lon: -122.4194, country: 'US' },
  'Seattle': { lat: 47.6062, lon: -122.3321, country: 'US' },
  'Denver': { lat: 39.7392, lon: -104.9903, country: 'US' },
  'Atlanta': { lat: 33.7490, lon: -84.3880, country: 'US' },
  'Miami': { lat: 25.7617, lon: -80.1918, country: 'US' },
  'Boston': { lat: 42.3601, lon: -71.0589, country: 'US' },
  'Detroit': { lat: 42.3314, lon: -83.0458, country: 'US' },
  'Minneapolis': { lat: 44.9778, lon: -93.2650, country: 'US' },
  'Portland': { lat: 45.5051, lon: -122.6750, country: 'US' },
  'Las Vegas': { lat: 36.1699, lon: -115.1398, country: 'US' },
  'Washington DC': { lat: 38.9072, lon: -77.0369, country: 'US' },
  'Toronto': { lat: 43.6532, lon: -79.3832, country: 'CA' },
  'Montreal': { lat: 45.5017, lon: -73.5673, country: 'CA' },
  'Vancouver': { lat: 49.2827, lon: -123.1207, country: 'CA' },
  'Calgary': { lat: 51.0447, lon: -114.0719, country: 'CA' },
  'Ottawa': { lat: 45.4215, lon: -75.6972, country: 'CA' },
  'Mexico City': { lat: 19.4326, lon: -99.1332, country: 'MX' },
  'Guadalajara': { lat: 20.6597, lon: -103.3496, country: 'MX' },
  'Monterrey': { lat: 25.6866, lon: -100.3161, country: 'MX' },
  'Havana': { lat: 23.1136, lon: -82.3666, country: 'CU' },
  'Guatemala City': { lat: 14.6349, lon: -90.5069, country: 'GT' },
  'San José': { lat: 9.9281, lon: -84.0907, country: 'CR' },
  'Panama City': { lat: 8.9936, lon: -79.5197, country: 'PA' },

  // --- SOUTH AMERICA ---
  'São Paulo': { lat: -23.5505, lon: -46.6333, country: 'BR' },
  'Rio de Janeiro': { lat: -22.9068, lon: -43.1729, country: 'BR' },
  'Brasília': { lat: -15.7942, lon: -47.8825, country: 'BR' },
  'Manaus': { lat: -3.1190, lon: -60.0217, country: 'BR' },
  'Belo Horizonte': { lat: -19.9167, lon: -43.9345, country: 'BR' },
  'Buenos Aires': { lat: -34.6037, lon: -58.3816, country: 'AR' },
  'Córdoba': { lat: -31.4201, lon: -64.1888, country: 'AR' },
  'Lima': { lat: -12.0464, lon: -77.0428, country: 'PE' },
  'Bogotá': { lat: 4.7110, lon: -74.0721, country: 'CO' },
  'Medellín': { lat: 6.2476, lon: -75.5658, country: 'CO' },
  'Santiago': { lat: -33.4489, lon: -70.6693, country: 'CL' },
  'Caracas': { lat: 10.4806, lon: -66.9036, country: 'VE' },
  'Quito': { lat: -0.1807, lon: -78.4678, country: 'EC' },
  'La Paz': { lat: -16.5000, lon: -68.1500, country: 'BO' },
  'Montevideo': { lat: -34.9011, lon: -56.1645, country: 'UY' },
  'Asunción': { lat: -25.2867, lon: -57.6470, country: 'PY' },

  // --- OCEANIA ---
  'Sydney': { lat: -33.8688, lon: 151.2093, country: 'AU' },
  'Melbourne': { lat: -37.8136, lon: 144.9631, country: 'AU' },
  'Brisbane': { lat: -27.4698, lon: 153.0251, country: 'AU' },
  'Perth': { lat: -31.9505, lon: 115.8605, country: 'AU' },
  'Adelaide': { lat: -34.9285, lon: 138.6007, country: 'AU' },
  'Auckland': { lat: -36.8509, lon: 174.7645, country: 'NZ' },
  'Wellington': { lat: -41.2865, lon: 174.7762, country: 'NZ' },

  // --- CENTRAL ASIA ---
  'Tashkent': { lat: 41.2995, lon: 69.2401, country: 'UZ' },
  'Almaty': { lat: 43.2220, lon: 76.8512, country: 'KZ' },
  'Astana': { lat: 51.1801, lon: 71.4460, country: 'KZ' },
  'Bishkek': { lat: 42.8746, lon: 74.5698, country: 'KG' },
  'Dushanbe': { lat: 38.5598, lon: 68.7870, country: 'TJ' },
}

// Generate realistic mock data for a city
function generateMockData(city) {
  const cityData = CITY_LOCATION_MAP[city] || { lat: 0, lon: 0, country: 'XX' }

  // Cities known for poor air quality get higher values
  const pollutedCities = [
    'Delhi', 'Beijing', 'Dhaka', 'Kolkata', 'Karachi', 'Mumbai',
    'Lahore', 'Kabul', 'Kanpur', 'Faridabad', 'Ghaziabad', 'Patna',
    'Agra', 'Meerut', 'Lucknow', 'Varanasi', 'Harbin', 'Ulaanbaatar',
    'Khartoum', 'Lagos', 'Cairo', 'Kinshasa', 'Tehran', 'Baghdad',
    'Chongqing', 'Wuhan', 'Shenyang', 'Tianjin', 'Xian', 'Zhengzhou',
    'Chittagong', 'Kathmandu', 'Islamabad', 'Luanda', 'Yangon',
  ]
  const isPolluted = pollutedCities.includes(city)
  const baseMultiplier = isPolluted ? 2.5 : 1

  const pm25 = +(Math.random() * 80 * baseMultiplier + 5).toFixed(1)
  const pm10 = +(pm25 * (1.5 + Math.random() * 0.5)).toFixed(1)
  const o3 = +(Math.random() * 60 + 20).toFixed(1)
  const no2 = +(Math.random() * 50 * baseMultiplier + 5).toFixed(1)
  const so2 = +(Math.random() * 20 * baseMultiplier + 1).toFixed(1)
  const co = +(Math.random() * 2 * baseMultiplier + 0.2).toFixed(2)

  const aqi = calculateAQI(pm25)

  return {
    city,
    country: cityData.country,
    coordinates: { lat: cityData.lat, lon: cityData.lon },
    aqi,
    aqiCategory: getAQICategory(aqi),
    pollutants: {
      pm25: { value: pm25, unit: 'µg/m³', label: 'PM2.5' },
      pm10: { value: pm10, unit: 'µg/m³', label: 'PM10' },
      o3: { value: o3, unit: 'µg/m³', label: 'Ozone (O₃)' },
      no2: { value: no2, unit: 'µg/m³', label: 'NO₂' },
      so2: { value: so2, unit: 'µg/m³', label: 'SO₂' },
      co: { value: co, unit: 'mg/m³', label: 'CO' },
    },
    timestamp: new Date().toISOString(),
    source: 'OpenAQ (Demo)',
    stationName: `${city} Central Station`,
  }
}

function generateHistoricalMock(city) {
  const now = new Date()
  const isPolluted = ['Delhi', 'Beijing', 'Dhaka', 'Kolkata', 'Lahore', 'Kanpur', 'Patna'].includes(city)
  const base = isPolluted ? 120 : 50

  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now.getTime() - (23 - i) * 3600 * 1000)
    const variation = Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 15
    const pm25 = Math.max(5, base + variation)
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      timestamp: time.toISOString(),
      pm25: +pm25.toFixed(1),
      pm10: +(pm25 * 1.6).toFixed(1),
      o3: +(30 + Math.random() * 40).toFixed(1),
      no2: +(15 + Math.random() * 35).toFixed(1),
      aqi: calculateAQI(pm25),
    }
  })
}

// Try to fetch real data, fall back to mock
export async function fetchAirQualityData(city) {
  try {
    const coords = CITY_LOCATION_MAP[city]
    if (!coords) throw new Error('City not in lookup table')

    // Fetch latest measurements near city coordinates
    const response = await api.get('/locations', {
      params: {
        coordinates: `${coords.lat},${coords.lon}`,
        radius: 25000,
        limit: 5,
        order_by: 'lastUpdated',
        sort: 'desc',
      },
    })

    const locations = response.data?.results
    if (!locations || locations.length === 0) throw new Error('No stations found')

    // Get the latest measurements from the first few stations
    const locationId = locations[0].id
    const measResponse = await api.get(`/locations/${locationId}/latest`)
    const measurements = measResponse.data?.results?.[0]?.sensors

    if (!measurements || measurements.length === 0) throw new Error('No measurements')

    // Parse into our format
    const pollutants = {}
    const paramMap = { pm25: 'PM2.5', pm10: 'PM10', o3: 'Ozone (O₃)', no2: 'NO₂', so2: 'SO₂', co: 'CO' }

    measurements.forEach((m) => {
      const key = m.parameter?.name?.toLowerCase().replace('.', '')
      if (key && paramMap[key]) {
        pollutants[key] = {
          value: +m.value.toFixed(2),
          unit: m.parameter?.units || 'µg/m³',
          label: paramMap[key],
        }
      }
    })

    const pm25 = pollutants.pm25?.value || 0
    const aqi = calculateAQI(pm25)

    return {
      city,
      country: coords.country,
      coordinates: { lat: coords.lat, lon: coords.lon },
      aqi,
      aqiCategory: getAQICategory(aqi),
      pollutants: { ...generateMockData(city).pollutants, ...pollutants },
      timestamp: new Date().toISOString(),
      source: 'OpenAQ',
      stationName: locations[0].name || `${city} Station`,
    }
  } catch {
    // Graceful fallback to realistic mock data
    return generateMockData(city)
  }
}

export async function fetchHistoricalData(city) {
  return generateHistoricalMock(city)
}

export async function searchCities(query) {
  const allCities = Object.keys(CITY_LOCATION_MAP)
  const q = query.toLowerCase()
  return allCities
    .filter((c) => c.toLowerCase().includes(q))
    .map((c) => ({ name: c, country: CITY_LOCATION_MAP[c].country }))
}

// AQI calculation (US EPA formula based on PM2.5)
export function calculateAQI(pm25) {
  if (pm25 < 0) return 0
  const breakpoints = [
    { cLow: 0,     cHigh: 12.0,  iLow: 0,   iHigh: 50  },
    { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100 },
    { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150 },
    { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ]
  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
      )
    }
  }
  return 500
}

export function getAQICategory(aqi) {
  if (aqi <= 50)  return { label: 'Good',            color: 'good',      bg: 'bg-aqi-good',      text: 'text-aqi-good',      description: 'Air quality is satisfactory.' }
  if (aqi <= 100) return { label: 'Moderate',        color: 'moderate',  bg: 'bg-aqi-moderate',  text: 'text-aqi-moderate',  description: 'Acceptable; some pollutants may affect sensitive people.' }
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'sensitive', bg: 'bg-aqi-sensitive', text: 'text-aqi-sensitive', description: 'Sensitive groups may experience health effects.' }
  if (aqi <= 200) return { label: 'Unhealthy',       color: 'unhealthy', bg: 'bg-aqi-unhealthy',  text: 'text-aqi-unhealthy', description: 'Everyone may begin to experience health effects.' }
  if (aqi <= 300) return { label: 'Very Unhealthy',  color: 'very',      bg: 'bg-aqi-very',       text: 'text-aqi-very',      description: 'Health warnings of emergency conditions.' }
  return           { label: 'Hazardous',             color: 'hazardous', bg: 'bg-aqi-hazardous',  text: 'text-aqi-hazardous', description: 'Health alert: everyone may experience serious effects.' }
}

export const KNOWN_CITIES = Object.keys(CITY_LOCATION_MAP)