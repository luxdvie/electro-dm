#ifndef HEADER_GLOBALS
#define HEADER_GLOBALS

#include <Adafruit_NeoPixel.h>

class Globals {
	public:
		static int ledPin;
		static int numLEDs;
		static int numPlayers;
		static int maxPlayers;
		static Adafruit_NeoPixel strip;
};

#endif