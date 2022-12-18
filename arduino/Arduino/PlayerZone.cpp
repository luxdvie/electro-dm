#include <Arduino.h>
#include "PlayerZone.h"

PlayerZone::PlayerZone() {
}

void PlayerZone::render() {  
  int start = this->position;
  int stop = start + this->playerLEDCount;

  for (int i = start; i < stop; i++) {
    Globals::strip.setPixelColor(i, 0, 100, 0, 0);
  }

  if (this->offsetPongOffset >= this->offset) {
    this->offsetPongDirection = 1; // going down
  }

  if (this->offsetPongOffset <= this->offsetPongOffsetMin) {
    this-> offsetPongDirection = 0; // going up
  }

  start = start + this->offset + this->offsetPongOffset;
  stop = start + this->lightLength;
  for (int i = start; i < stop; i++) {
    Globals::strip.setPixelColor(i, 50, 50, 50, 50);
  }


  if (this->offsetPongDirection == 0) {
    this->offsetPongOffset += 2; // going up
  } else {
    this->offsetPongOffset -= 2; // going down
  }
}

void PlayerZone::enable(int position, int offset, int playerLEDCount, int lightLength) {
  this->position = position;
  this->offset = offset;
  this->lightLength = lightLength;
  this->playerLEDCount = playerLEDCount;

  this->offsetPongOffset = 0;
  this->offsetPongDirection = 0; // going up
  this->offsetPongOffsetMin = -1 * offset;
}

