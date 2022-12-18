#include <Arduino.h>
#include "Controller.h"

/*
  Rules:
    Only one player can be active at a time.
    A fireball can be invoked any time while a player is showing.
    A "currentPlayer" value of 999 means "don't show any players".

  Commands:
    P1...P6: Show Player 1 or n
    PD: Show the DM
    PN: Show the next player, resets to 0 at the end
    PP: Show the previous player, resets to the last player at the beginning
    F: Render a variable-length, variable-duration fireball
    Off: Disable currentPlayer and any animations, turn off all LEDs
*/

Controller::Controller(PlayerZone* players) {
  this->currentPlayer = 999; // 999 means 'no one', '998' means 'DM'
  this->addFire = 0;
  this->firePosition = 0;
  this->fireOffset = 0;
  this->players = players;
}

void Controller::render() {
  Globals::strip.clear();

  if (this->disable == 1) {
    Globals::strip.show();
    return;
  }

  if (this->rainbowFramesRemaining > 0) {
    this->renderRainbow();
  }

  // currentPlayer of 999 means "don't show any players"
  // currentPlayer of 998 means "show the DM"
  if (this->currentPlayer == 998) {
    this->renderDM();
  } else if (this->currentPlayer != 999) {
    this->players[this->currentPlayer].render();
  }

  if (this->addFire == 1) {
    this->renderFire(); 
  }
  
  Globals::strip.show();
}

void Controller::renderFire() {   
  if (this->fireFramesRemaining <= 0) {
    this->addFire = 0;
    this->firePosition = 0;
    this->fireOffset = 0;
    this->fireTailLength = 0;
    this->fireTailOffset = 0;
    return;
  }

  this->fireOffset = random(1, 3);
  this->firePosition += (this->fireOffset * 2);

  int heatStart = this->firePosition;
  int heatStop = heatStart + this->fireLength;
  for (int i = heatStart; i < heatStop; i++) {
    if (i >= heatStop - 3) {
      Globals::strip.setPixelColor(i, random(10, 20), random(200, 255), random(20, 25), random(10, 25));  
    } else {
      Globals::strip.setPixelColor(i, 10, 255, 5, 0);  
    }    
  }

  this->fireTailOffset = random(1, 5);
  
  int tailStop = this->firePosition -1;
  int tailStart = tailStop - this->fireTailLength - this->fireTailOffset;
  for (int i = tailStart; i < tailStop; i++) {
    Globals::strip.setPixelColor(i, 10, 255, 5, 170);
  }
  
  this->fireFramesRemaining--;
}

void Controller::switchPlayer(int playerIndex) {
  this->currentPlayer = playerIndex;
}

void Controller::sendCommand(char* buf, int size) {
  if (buf[0] == 'O' && buf[1] == 'f' && buf[2] == 'f') {
     this->disable = 1;
     this->addFire = 0;
     this->fireFramesRemaining = 0;
     this->currentPlayer = 999;
     return;
  }

  if (buf[0] == 'R') {
     this->rainbowFramesRemaining = random(25, 40);
     this->disable = 0;
     return;
  }

  if (buf[0] == 'F') {
    this->addFire = 1;
    this->fireFramesRemaining = random(25, 40);
    this->fireLength = random(25, 40);
    this->fireTailLength = random(4, 8);
    this->disable = 0;
    return;
  }
 
 if (buf[0] == 'P') {
    this->disable = 0;
    this->executePlayerCommand(buf[1]);
 }
}

void Controller::executePlayerCommand(char segment) {
  // TODO: This could be way better, but I'm lazy.
  if (segment == '1') {
		this->currentPlayer = 0;
	} else if (segment == '2') {
		this->currentPlayer = 1;
	} else if (segment == '3') {
		this->currentPlayer = 2;
	} else if (segment == '4') {
		this->currentPlayer = 3;
	} else if (segment == '5') {
		this->currentPlayer = 4;
	} else if (segment == '6') {
		this->currentPlayer = 5;
	} else if (segment == 'N') { // Next player
		this->currentPlayer++;
	} else if (segment == 'P') { // Previous player
		this->currentPlayer--;	
	} else if (segment == 'D') { // Previous player
   this->currentPlayer = 998;  
   return;
  }

  if (this->currentPlayer >= Globals::numPlayers) {
    this->currentPlayer = 0;
  }

  if (this->currentPlayer < 0) {
    this->currentPlayer = Globals::numPlayers - 1;
  }
}

void Controller::renderDM() {
  int start = 0;;
  int stop = start + Globals::numLEDs;

  // First apply a red background
  for (int i = start; i < stop; i++) {
    Globals::strip.setPixelColor(i, 0, 60, 0, 0);
  }


  int dmPulseSpeed = 5;
  int dmPulseLength = 15;

  int pulse1Start = 0 + this->dmPulseOffset;
  int pulse2Start = Globals::numLEDs - this->dmPulseOffset;

  // Pulse 1
  stop = pulse1Start + dmPulseLength;
  for (int i = pulse1Start; i < stop; i++) {
    Globals::strip.setPixelColor(i, 80, 80, 10);
  }

  // Pulse 2
  stop = pulse2Start - dmPulseLength;
  for (int i = pulse2Start; i >= stop; i--) {
    Globals::strip.setPixelColor(i, 80, 80, 10);
  }
  
  this->dmPulseOffset += dmPulseSpeed;
  if (this->dmPulseOffset >= Globals::numLEDs) {
    this->dmPulseOffset = 0;
  }
}

void Controller::setup() {  
  int playerNumLEDs = Globals::numLEDs / Globals::numPlayers;
  int playerLightLength = playerNumLEDs / 2;
  int playerOffset = (playerNumLEDs - playerLightLength) / 2;

  for (int i = 0; i < Globals::numPlayers; i++) {
    this->players[i].enable(playerNumLEDs * i, playerOffset, playerNumLEDs, playerLightLength);
  }
}

// Rainbow cycle along whole strip. Pass delay time (in ms) between frames.
void Controller::renderRainbow() {
  // Hue of first pixel runs 5 complete loops through the color wheel.
  // Color wheel has a range of 65536 but it's OK if we roll over, so
  // just count from 0 to 5*65536. Adding 256 to firstPixelHue each time
  // means we'll make 5*65536/256 = 1280 passes through this loop:
  for(long firstPixelHue = 0; firstPixelHue < 5*65536; firstPixelHue += 256) {
    // strip.rainbow() can take a single argument (first pixel hue) or
    // optionally a few extras: number of rainbow repetitions (default 1),
    // saturation and value (brightness) (both 0-255, similar to the
    // ColorHSV() function, default 255), and a true/false flag for whether
    // to apply gamma correction to provide 'truer' colors (default true).
    Globals::strip.rainbow(firstPixelHue);
    Globals::strip.setBrightness(20);
    delay(10);
    Globals::strip.show();
  }

  this->rainbowFramesRemaining--;
}
