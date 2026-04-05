export async function fetchSignals(){

const [news, markets, crypto] = await Promise.all([

fetch("https://api.gdeltproject.org/api/v2/doc/doc?query=war&mode=ArtList&maxrecords=50&format=json"),

fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=demo"),

fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")

])

return {
news: await news.json(),
markets: await markets.json(),
crypto: await crypto.json()
}

}