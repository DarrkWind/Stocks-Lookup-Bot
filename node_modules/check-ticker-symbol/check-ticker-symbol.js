// check-ticker-symbol.js (c) 2015 Marius <marius@twostairs.com>
// May be freely distributed under the MIT license.
// For further details and documentation:
// https://github.com/twostairs/node-check-ticker-symbol

/**
 * @module check-ticker-symbol
 * @class CheckTickerSymbol
 */
var CheckTickerSymbol = function() {
	var self = this;
};

/**
 * @method valid
 * @param symbol {string} - The actual ticker symbol
 * @return valid {bool} - Validity, true or false
 */
CheckTickerSymbol.prototype.valid = function(symbol) {
	var self = this;
	// Return the validity
	return (self.disassemble(symbol) === null ? false : true);
};

/**
 * @method disassemble
 * @param symbol {string} - The actual ticker symbol
 * @return disassembled {mixed} - Disassembled symbol (object) or null if symbol is invalid
 */
CheckTickerSymbol.prototype.disassemble = function(symbol) {
	if(symbol === null || symbol === undefined){
		throw new Error("check-ticker-symbol expects the symbol to not be null or undefined");
	}

	var self = this;
	var re = /^(([a-z]{2,4}):(?![a-z\d]+\.))?([a-z]{1,4}|\d{1,3}(?=\.)|\d{4,})(\.([a-z]{2}))?$/i;

	// disassembled will be an array with max. 4 fields:
	// 0: full search
	// 1: Prefixed exchange code with separator
	// 2: Prefixed exchange code without separator
	// 3: Stock
	// 4: Suffixed exchange code with separator
	// 5: Suffixed exchange code without separator
	disassembledArray = re.exec(symbol);

	if(disassembledArray === null) {
		return null;
	}

	disassembled = {
		"search": disassembledArray[0],
		"prefixedExchangeCode": disassembledArray[2],
		"stock": disassembledArray[3],
		"suffixedExchangeCode": disassembledArray[5]
	}

	// Return the disassembled symbol (object)
	return disassembled;
};

var check_ticker_symbol = module.exports = new CheckTickerSymbol();
