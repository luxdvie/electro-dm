#ifndef HEADER_GLOBALS
#define HEADER_GLOBALS

#include <Adafruit_NeoPixel.h>

class Globals {
	public:
		static int ledPin;
		static int numLEDs;
		static int numPlayers;
		static int maxPlayers;
    static int brightness;
		static Adafruit_NeoPixel strip;
    static bool configureStrip(int numLEDs, int numPlayers);
};

#endif
