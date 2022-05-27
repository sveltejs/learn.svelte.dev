Adaptation of http://www.masswerk.at/elizabot/ eliza chat bot to node.js command line app.

elizabot.js v.1.1 - ELIZA JS library (N.Landsteiner 2005)
Eliza is a mock Rogerian psychotherapist.
Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language
		Communication Between Man and Machine"
		in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.
JavaScript implementation by Norbert Landsteiner 2005; <http://www.masserk.at>

synopsis:

	new ElizaBot( <random-choice-disable-flag> )
	ElizaBot.prototype.transform( <inputstring> )
	ElizaBot.prototype.getInitial()
	ElizaBot.prototype.getFinal()
	ElizaBot.prototype.reset()

usage:

	var eliza = new ElizaBot();
	var initial = eliza.getInitial();
	var reply = eliza.transform(inputstring);
	if (eliza.quit) {
		// last user input was a quit phrase
	}

	// method `transform()' returns a final phrase in case of a quit phrase
	// but you can also get a final phrase with:
	var final = eliza.getFinal();

	// other methods: reset memory and internal state
	eliza.reset();

	// to set the internal memory size override property `memSize':
	eliza.memSize = 100; // (default: 20)

	// to reproduce the example conversation given by J. Weizenbaum
	// initialize with the optional random-choice-disable flag
	var originalEliza = new ElizaBot(true);

`ElizaBot` is also a general chatbot engine that can be supplied with any rule set.
(for required data structures cf. "elizadata.js" and/or see the documentation.)
data is parsed and transformed for internal use at the creation time of the
first instance of the `ElizaBot' constructor.

vers 1.1: lambda functions in RegExps are currently a problem with too many browsers.
					changed code to work around.