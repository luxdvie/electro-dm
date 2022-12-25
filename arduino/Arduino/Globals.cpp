#include <Adafruit_NeoPixel.h>
#include "Globals.h"

  int Globals::ledPin = D6;
  int Globals::numLEDs = 20;
  int Globals::numPlayers = 2;
  int Globals::maxPlayers = 6;

  // IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
  // pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
  // and minimize distance between Arduino and first pixel.  Avoid connecting
  // on a live circuit...if you must, connect GND first.
  //   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
  //   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
  //   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
  Adafruit_NeoPixel Globals::strip = Adafruit_NeoPixel(numLEDs, ledPin, NEO_RGBW + NEO_KHZ800);

  bool Globals::configureStrip(int numLEDs, int numPlayers) {  
    if (numLEDs == Globals::numLEDs && numPlayers == Globals::numPlayers) {
      return false; // Don't waste the resources to recreate the strip if it already matches
    }

    Globals::numLEDs = numLEDs;
    Globals::numPlayers = numPlayers;
    Globals::strip.updateLength(Globals::numLEDs);
    return true;
  }
