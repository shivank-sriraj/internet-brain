export function computeRisk({ conflicts, markets, crypto }){

const conflictScore = Math.min(conflicts.length / 50, 1)

const marketVol = Math.abs((markets?.['Global Quote']?.['05. price'] || 100) - 100) / 100

const cryptoVol = Math.abs((crypto?.bitcoin?.usd || 50000) - 50000) / 50000

const score = conflictScore*0.5 + marketVol*0.3 + cryptoVol*0.2

return Math.min(score * 10, 10)

}