#ifndef MY_PLAYER_ZONE_H
#define MY_PLAYER_ZONE_H

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include "Globals.h"

class PlayerZone {

  private:
  	int position;
  	int offset;
    int offsetPongOffset;
    int offsetPongDirection;
    int offsetPongOffsetMin;
    int playerLEDCount;
    int lightLength;

  public:
    PlayerZone();
    void enable(int position, int offset, int playerLEDCount, int lightLength);
    void render();
};

#endif
