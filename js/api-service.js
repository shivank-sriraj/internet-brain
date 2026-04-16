// API Service for all data fetching
class APIService {
    // ACLED - Armed Conflict Location & Event Data
    static async getConflicts() {
        try {
            const response = await fetch(
                'https://api.acleddata.com/api/events/?limit=1000&iso=0'
            );
            const data = await response.json();
            console.log('ACLED Data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching conflicts:', error);
            return null;
        }
    }

    // CoinGecko - Cryptocurrency Markets (No API key needed!)
    static async getCryptoData() {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/markets?vs_currency=usd&order=market_cap_desc&per_page=15&sparkline=true&price_change_percentage=24h'
            );
            const data = await response.json();
            console.log('Crypto Data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching crypto:', error);
            return [];
        }
    }

    // OpenSky Network - Live Flight Tracking
    static async getFlights(lamin = -90, lamax = 90, lomin = -180, lomax = 180) {
        try {
            const response = await fetch(
                `https://opensky-network.org/api/states/all?lamin=${lamin}&lamax=${lamax}&lomin=${lomin}&lomax=${lomax}`
            );
            const data = await response.json();
            console.log('Flight Data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching flights:', error);
            return { states: [] };
        }
    }

    // GDELT - Global Event Database
    static async getGDELTEvents(query = 'conflict') {
        try {
            const response = await fetch(
                `https://api.gdeltproject.org/api/v2/search/timeline?query=${query}%20global&format=json&sourcelang=eng&sort=DateDesc`
            );
            const data = await response.json();
            console.log('GDELT Data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching GDELT:', error);
            return null;
        }
    }
}