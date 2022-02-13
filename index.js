const {Client, Intents, MessageAttachment, MessageEmbed} = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require("axios");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const cts = require('check-ticker-symbol');

const token = 'OTIzNDEyNTE3NdDA4MTAd4NjId1.Yo7A.GKCmM5msYHkXO4XeRLUY2KWMTzs';

var symbol = '';
var prices;
var dates;

var fiftyTwoWeekLow;
var fiftyTwoWeekHigh;
var trailingAnnualDividendYield;
var marketCap;
var trailingPE;
var regularMarketOpen;
var regularMarketChange;
var regularMarketChangePercent;
var regularMarketPrice;
var regularMarketDayHigh;
var regularMarketDayLow;
var averageDailyVolume3Month;
var longName;

const config = {
	method: 'GET',
	params: {modules: 'defaultKeyStatistics,assetProfile'},
	headers: {
	  'X-API-KEY': 'r8YWWSCBNIaB2eTm4BUEw6AOKS2tL8Bn6uJuhMAz',
	  'accept' : 'application/json'
	}
};

const plugin = {
	beforeDraw: (chart) => {
	const ctx = chart.canvas.getContext('2d');
	ctx.save();
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, chart.width, chart.height);
	ctx.restore();
	},
	legend: {
		display: false
	},
	tooltips: {
		enabled: false
	}
};

async function getData(urls,options) {
	const chartReqURL = axios.get(urls[0],options);
	const quoteReqURL = axios.get(urls[1],options);
	await axios.all([chartReqURL,quoteReqURL]).then(axios.spread((...response)=>{
	//await axios.request(options).then(function (response) {
	
	for (const item of response[0].data.chart.result[0].timestamp) {
		var date = new Date(item * 1000);
		dates.push(`${date.getDay()}` + '/' + `${date.getMonth()}`);
	}
	for (const item of response[0].data.chart.result[0].indicators.quote[0].close) {
		prices.push(item);
	}
	//console.log(JSON.stringify(response[1].data.quoteResponse.result[0],null,2));
	fiftyTwoWeekLow = JSON.stringify(response[1].data.quoteResponse.result[0].fiftyTwoWeekLow);
	fiftyTwoWeekHigh = JSON.stringify(response[1].data.quoteResponse.result[0].fiftyTwoWeekHigh);
	trailingAnnualDividendYield = JSON.stringify(response[1].data.quoteResponse.result[0].trailingAnnualDividendYield);
	marketCap = JSON.stringify(response[1].data.quoteResponse.result[0].marketCap);
	trailingPE = JSON.stringify(response[1].data.quoteResponse.result[0].trailingPE);
	regularMarketOpen = JSON.stringify(response[1].data.quoteResponse.result[0].regularMarketOpen);
	regularMarketChange = JSON.stringify(response[1].data.quoteResponse.result[0].regularMarketChange);
	regularMarketChangePercent = JSON.stringify(response[1].data.quoteResponse.result[0].regularMarketChangePercent);
	regularMarketPrice = JSON.stringify(response[1].data.quoteResponse.result[0].regularMarketPrice);
	regularMarketDayHigh = JSON.stringify(response[1].data.quoteResponse.result[0].regularMarketDayHigh);
	regularMarketDayLow = JSON.stringify(response[1].data.quoteResponse.result[0].regularMarketDayLow);
	averageDailyVolume3Month = JSON.stringify(response[1].data.quoteResponse.result[0].averageDailyVolume3Month);
	longName = JSON.stringify(response[1].data.quoteResponse.result[0].longName);
	
	})).catch(function (error) {
		console.error(error);
	});	
		
}

//https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}

function decFormat (num) {
	return (Math.round(num * 100) / 100).toFixed(2);
}

bot.on('ready',() => {
    console.log('Bot Activated!');

});

bot.on('messageCreate', (msg) => {
    let args = msg.content.split(" ");
    //console.log(msg);
    switch(args[0]) {
        case '!hi':
        	msg.channel.send('welcome.');
            break;
        case '!stock':
			const height = 900;
			const width = 1200;	
			dates = [];
			prices = [];	
			const chartCanvas = new ChartJSNodeCanvas({width,height});
			if (args.length == 2) {
				symbol = args[1].toUpperCase();
			} else {
				symbol = '';
			}
			

			var urls = [`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&region=US&interval=1d&lang=en&events=div%2Csplit`,
				`https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbol}`]
			
			if(cts.valid(symbol)){ 
				(async ()=>{
					await getData(urls,config);
					const configuration= {
						type: 'line',
						data: {
							labels: dates,
							datasets: [{
								label: symbol,
								data: prices,
								borderColor: 'rgb(234,67,53)',
								tension: 0.1
							}]
						},
						options: {},
						plugins: [plugin]
					};
					const graph = await chartCanvas.renderToBuffer(configuration);
					const attachment = new MessageAttachment(graph,'chart.png')
					const stockChart = new MessageEmbed()
					.setColor(16522069)
					.setTitle(symbol)
					.addField(longName,'\u200b')
					.setDescription('\u200b')
					.addField(decFormat(regularMarketPrice),`**${decFormat(regularMarketChange)}** (${decFormat(regularMarketChangePercent)})`)
					.addFields(
						{name: 'Open', value: decFormat(regularMarketOpen),inline: true},
						{name: 'Low', value: decFormat(regularMarketDayLow),inline: true},
						{name: 'High', value: decFormat(regularMarketDayHigh),inline: true},
						{name: 'P/E Ratio', value: decFormat(trailingPE),inline: true},
						{name: 'Mtk cap', value: abbrNum(marketCap,2),inline: true},
						{name: 'Div yield', value: decFormat(trailingAnnualDividendYield),inline: true},
						{name: '52-wk High', value: decFormat(fiftyTwoWeekHigh),inline: true},
						{name: '52-wk Low', value: decFormat(fiftyTwoWeekLow),inline: true},
						{name: 'Avg Vol', value: abbrNum(averageDailyVolume3Month,2),inline: true}
						
					)
					.setImage('attachment://chart.png')
					.setTimestamp();
					msg.channel.send({embeds: [stockChart], files: [attachment]});
				})();
			} else {
				const errorEmbed = new MessageEmbed()
				.setColor(16522069)
				.setDescription('Invalid Ticker Found! Cannot display data!')
				msg.channel.send({embeds: [errorEmbed]});
			}
			
            break;
    }
});

bot.login(token);
