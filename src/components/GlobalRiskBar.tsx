export function GlobalRiskBar({ score }){
return (
<div style={{padding:16,background:"black",color:"white",borderRadius:12}}>
<h2>Global Risk Level</h2>
<div style={{fontSize:32}}>{score.toFixed(1)} / 10</div>
<div style={{width:"100%",height:8,background:"#444",marginTop:8}}>
<div style={{height:8,background:"red",width:`${score*10}%`}} />
</div>
</div>
)
}