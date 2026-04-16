// Main Application Logic
class InternetBrain {
    constructor() {
        this.mapHandlers = {};
        this.setupNavigation();
        this.setupPageTransitions();
        this.initDashboard();
        this.updateTimestamp();
    }

    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showPage(target);
            });
        });
    }

    setupPageTransitions() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '1') this.showPage('dashboard');
                if (e.key === '2') this.showPage('predictions');
                if (e.key === '3') this.showPage('tracking');
            }
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        document.getElementById(pageId).classList.add('active');

        if (pageId === 'dashboard') {
            this.initDashboard();
        } else if (pageId === 'predictions') {
            this.initPredictions();
        } else if (pageId === 'tracking') {
            this.initTracking();
        }
    }

    async initDashboard() {
        console.log('Initializing Dashboard...');

        if (this.mapHandlers.conflict) {
            return;
        }

        const mapHandler = new MapHandler('conflict-map');
        this.mapHandlers.conflict = mapHandler;

        try {
            const conflictData = await APIService.getConflicts();

            if (conflictData && conflictData.data) {
                mapHandler.addConflictMarkers(conflictData.data);
                this.updateConflictStats(conflictData.data);

                document.getElementById('loading-dashboard').style.display = 'none';

                setInterval(async () => {
                    const updated = await APIService.getConflicts();
                    if (updated && updated.data) {
                        mapHandler.addConflictMarkers(updated.data);
                        this.updateConflictStats(updated.data);
                    }
                }, 5 * 60 * 1000);
            } else {
                document.getElementById('conflict-stats').innerHTML = '<div class="error">❌ Failed to load conflict data</div>';
            }
        } catch (error) {
            console.error('Dashboard init error:', error);
            document.getElementById('conflict-stats').innerHTML = '<div class="error">❌ Error loading conflict data</div>';
        }
    }

    updateConflictStats(events) {
        const totalEvents = events.length;
        const totalFatalities = events.reduce((sum, e) => sum + (parseInt(e.fatalities) || 0), 0);
        const countries = new Set(events.map(e => e.country)).size;

        const eventTypes = {};
        events.forEach(e => {
            eventTypes[e.event_type] = (eventTypes[e.event_type] || 0) + 1;
        });

        const topEventType = Object.entries(eventTypes).sort((a, b) => b[1] - a[1])[0];

        let html = `
            <div class="stat-card">
                <h3>📊 Total Events</h3>
                <p>${totalEvents}</p>
            </div>
            <div class="stat-card">
                <h3>💔 Fatalities</h3>
                <p>${totalFatalities.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>🌍 Countries</h3>
                <p>${countries}</p>
            </div>
            <div class="stat-card">
                <h3>🎯 Top Event</h3>
                <p>${topEventType ? topEventType[0] : 'N/A'}</p>
            </div>
        `;

        document.getElementById('conflict-stats').innerHTML = html;
    }

    async initPredictions() {
        console.log('Initializing Predictions...');

        const container = document.getElementById('predictions-content');
        container.innerHTML = '<div class="loading">⏳ Loading market data...</div>';

        try {
            const cryptoData = await APIService.getCryptoData();

            if (cryptoData && cryptoData.length > 0) {
                let html = '';

                cryptoData.forEach(coin => {
                    const change = coin.market_cap_change_percentage_24h || 0;
                    const changeClass = change >= 0 ? 'change-positive' : 'change-negative';
                    const changeSymbol = change >= 0 ? '📈' : '📉';

                    html += `
                        <div class="prediction-card">
                            <h3>${coin.symbol.toUpperCase()} - ${coin.name}</h3>
                            <p>
                                <span class="label">Price</span>
                                <span class="value">$${coin.current_price.toLocaleString()}</span>
                            </p>
                            <p>
                                <span class="label">24h Change</span>
                                <span class="value ${changeClass}">${changeSymbol} ${change.toFixed(2)}%</span>
                            </p>
                            <p>
                                <span class="label">Market Cap</span>
                                <span class="value">$${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) : 'N/A'}B</span>
                            </p>
                        </div>
                    `;
                });

                container.innerHTML = html;
                document.getElementById('loading-predictions').style.display = 'none';

                if (!this.predictionRefreshInterval) {
                    this.predictionRefreshInterval = setInterval(() => this.initPredictions(), 60 * 1000);
                }
            } else {
                container.innerHTML = '<div class="error">❌ Failed to load cryptocurrency data</div>';
            }
        } catch (error) {
            console.error('Predictions init error:', error);
            container.innerHTML = '<div class="error">❌ Error loading market predictions</div>';
        }
    }

    async initTracking() {
        console.log('Initializing Flight Tracking...');

        if (this.mapHandlers.tracking) {
            return;
        }

        const mapHandler = new MapHandler('tracking-map');
        this.mapHandlers.tracking = mapHandler;

        try {
            const flightData = await APIService.getFlights();

            if (flightData && flightData.states) {
                const count = mapHandler.addFlightMarkers(flightData);
                document.getElementById('flight-count').textContent = `${count} aircraft`;
                document.getElementById('loading-tracking').style.display = 'none';

                document.getElementById('refresh-flights').addEventListener('click', async () => {
                    const updated = await APIService.getFlights();
                    if (updated && updated.states) {
                        const newCount = mapHandler.addFlightMarkers(updated);
                        document.getElementById('flight-count').textContent = `${newCount} aircraft`;
                    }
                });

                setInterval(async () => {
                    const updated = await APIService.getFlights();
                    if (updated && updated.states) {
                        const newCount = mapHandler.addFlightMarkers(updated);
                        document.getElementById('flight-count').textContent = `${newCount} aircraft`;
                    }
                }, 30 * 1000);
            } else {
                console.warn('No flight data available');
            }
        } catch (error) {
            console.error('Tracking init error:', error);
        }
    }

    updateTimestamp() {
        const now = new Date();
        document.getElementById('timestamp').textContent = now.toLocaleString();
        setInterval(() => {
            const now = new Date();
            document.getElementById('timestamp').textContent = now.toLocaleString();
        }, 60000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Internet Brain Dashboard Starting...');
    window.app = new InternetBrain();
});