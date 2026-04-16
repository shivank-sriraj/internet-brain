// Map Management and Visualization
class MapHandler {
    constructor(containerId, initialZoom = 2, initialLat = 20, initialLon = 0) {
        this.map = L.map(containerId).setView([initialLat, initialLon], initialZoom);
        this.initTileLayer();
        this.markers = [];
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 2
        }).addTo(this.map);
    }

    // Add conflict markers to the map
    addConflictMarkers(events) {
        this.clearMarkers();

        if (!events || events.length === 0) {
            console.warn('No conflict events to display');
            return;
        }

        events.forEach(event => {
            if (event.latitude && event.longitude) {
                const color = this.getSeverityColor(event.fatalities);
                const radius = Math.min(Math.log(event.fatalities + 1) * 3, 25);

                const marker = L.circleMarker(
                    [parseFloat(event.latitude), parseFloat(event.longitude)],
                    {
                        radius: radius,
                        fillColor: color,
                        color: color,
                        weight: 2,
                        opacity: 0.9,
                        fillOpacity: 0.7
                    }
                ).addTo(this.map);

                const popupContent = `
                    <div style="color: #e0e0e0;">
                        <b style="color: #00d4ff;">${event.event_type}</b><br>
                        <small>${event.event_date}</small><br>
                        <strong>Location:</strong> ${event.country}<br>
                        <strong>Fatalities:</strong> ${event.fatalities || 0}<br>
                        <strong>Notes:</strong> ${event.notes || 'N/A'}
                    </div>
                `;

                marker.bindPopup(popupContent);
                this.markers.push(marker);
            }
        });

        console.log(`Added ${this.markers.length} conflict markers`);
    }

    // Add flight markers to the map
    addFlightMarkers(flightData) {
        this.clearMarkers();

        if (!flightData || !flightData.states || flightData.states.length === 0) {
            console.warn('No flight data available');
            return;
        }

        const sampleRate = Math.max(1, Math.floor(flightData.states.length / 100));

        flightData.states.forEach((flight, index) => {
            if (index % sampleRate === 0 && flight[5] !== null && flight[6] !== null) {
                const lat = flight[6];
                const lon = flight[5];
                const callsign = flight[1] ? flight[1].trim() : 'Unknown';
                const altitude = flight[7] ? flight[7].toFixed(0) : 'N/A';
                const velocity = flight[9] ? flight[9].toFixed(0) : 'N/A';

                const marker = L.circleMarker([lat, lon], {
                    radius: 5,
                    fillColor: '#00ff88',
                    color: '#00d4ff',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.7
                }).addTo(this.map);

                const popupContent = `
                    <div style="color: #e0e0e0;">
                        <b style="color: #00d4ff;">${callsign}</b><br>
                        <strong>Altitude:</strong> ${altitude} m<br>
                        <strong>Speed:</strong> ${velocity} m/s<br>
                        <strong>Lat/Lon:</strong> ${lat.toFixed(3)}, ${lon.toFixed(3)}
                    </div>
                `;

                marker.bindPopup(popupContent);
                this.markers.push(marker);
            }
        });

        console.log(`Added ${this.markers.length} flight markers`);
        return this.markers.length;
    }

    // Get color based on severity (fatalities)
    getSeverityColor(fatalities) {
        if (fatalities > 500) return '#8B0000';
        if (fatalities > 100) return '#DC143C';
        if (fatalities > 50) return '#FF4500';
        if (fatalities > 10) return '#FF6347';
        if (fatalities > 0) return '#FFA500';
        return '#FFD700';
    }

    // Clear all markers from map
    clearMarkers() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
    }
}