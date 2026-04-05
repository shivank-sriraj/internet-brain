import { useEffect, useState } from "react"
import { fetchSignals } from "../services/signalService"
import TrackingMap from "./TrackingMap"
import { computeRisk } from "../algorithms/risk"
import { GlobalRiskBar } from "./GlobalRiskBar"

export default function Dashboard(){

const [signals,setSignals] = useState(null)
const [hotspots,setHotspots] = useState([])

useEffect(()=>{

async function load(){
const data = await fetchSignals()
setSignals(data)

const parsed = data.news?.articles?.map((a,i)=>({
id:i,
lat:a.sourcegeo_lat,
lng:a.sourcegeo_long,
label:a.title
})).filter(h=>h.lat && h.lng)

setHotspots(parsed || [])
}

load()
const i = setInterval(load,120000)
return ()=>clearInterval(i)

},[])

if(!signals) return <div>Loading Internet Brain...</div>

const risk = computeRisk({
conflicts: signals.news?.articles || [],
markets: signals.markets,
crypto: signals.crypto
})

return (
<div>
<h1>Internet Brain</h1>

<GlobalRiskBar score={risk} />

<TrackingMap hotspots={hotspots} />

</div>
)
}