var WebSocketServer = require('ws').Server,
ws = new WebSocketServer({port:8181});
var stocks = {
"AAPL": 95.0,
"MSFT": 50.0,
"AMZN": 300.0,
"GOOG": 550.0,
"YHOO": 35.0
}
function randomInterval(min, max) {
return Math.floor(Math.random()*(max-min+1)+min);
}
var stockUpdater;
var randomStockUpdater = function() {
for (var symbol in stocks) {
 if(stocks.hasOwnProperty(symbol)) {
 var randomizedChange = randomInterval(-150, 150);
 var floatChange = randomizedChange / 100;
 stocks[symbol] += floatChange;
 }
}
var randomMSTime = randomInterval(500, 2500);
stockUpdater = setTimeout(function() {
 randomStockUpdater();
}, randomMSTime)
}
randomStockUpdater();
ws.on('connection', function(ws)
 {
    console.log("Connection ready");
    var clientStockUpdater;
    var sendStockUpdates = function(ws) 
    {
        if(ws.readyState == 1) 
        {
            var stocksObj = {};
            for(var i=0; i<clientStocks.length; i++) 
            {
             symbol = clientStocks[i];
             stocksObj[symbol] = stocks[symbol];
            }
            ws.send(JSON.stringify(stocksObj));
        }       
    }   
    clientStockUpdater = setInterval(function()
            {
                sendStockUpdates(ws);
            }, 1000);
var clientStocks = [];
ws.on('message', function(message)
{
 var stock_request = JSON.parse(message);
 clientStocks = stock_request['stocks'];
 sendStockUpdates(ws);
});
ws.on('close', function() 
{
 if(typeof clientStockUpdater !== 'undefined')
    {
     clearInterval(clientStockUpdater);
    }
    });
});
