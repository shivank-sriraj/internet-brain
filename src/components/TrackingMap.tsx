import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function TrackingMap({ hotspots }){

return (
<div style={{width:"100%",height:"600px"}}>

<MapContainer center={[20,0]} zoom={2} style={{height:"100%"}}>

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

{hotspots.map(h => (
<CircleMarker key={h.id} center={[h.lat,h.lng]} radius={12} pathOptions={{color:"red"}}>
<Popup>{h.label}</Popup>
</CircleMarker>
))}

</MapContainer>

</div>
)
}