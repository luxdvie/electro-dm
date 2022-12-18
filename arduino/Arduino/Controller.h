#ifndef MY_CONTROLLER_H
#define MY_CONTROLLER_H

#include <Arduino.h>
#include "PlayerZone.h"
#include <Adafruit_NeoPixel.h>
#include "Globals.h"

class Controller {

  private:
    PlayerZone* players;
    int disable;
	  int currentPlayer;
	  int numLEDs;

    int addFire; // 0 is no; 1 is yes
    int fireFramesRemaining; // counts down how many renders will include fire
    int firePosition;
    int fireOffset;
    int fireLength;
    int fireTailLength;
    int fireTailOffset;
    
    int rainbowFramesRemaining;
    
    void renderFire();
    
    void renderDM();
    int dmPulseOffset;
    
    void renderRainbow();
    void executePlayerCommand(char segment);

  public:
    Controller(PlayerZone* players);
	  void switchPlayer(int playerIndex);
	  void setup();
	  void render();
    void sendCommand(char* buf, int size);
};

#endif
