#include "PlayerZone.h"
#include "Controller.h"
#include <SoftwareSerial.h>
SoftwareSerial ESPserial(2, 3); // RX | TX

PlayerZone players[] = {
  PlayerZone(),
  PlayerZone(),
  PlayerZone(),
  PlayerZone(),
  PlayerZone(),
  PlayerZone()
};
Controller controller  = Controller(players);


void setup() {
  Globals::strip.begin();
  Globals::strip.show(); // Initialize all pixels to 'off'

  Serial.begin(9600);
  delay(1000);
  Serial.println("Ready");
  
  Serial.setTimeout(100);
  randomSeed(analogRead(0));
  controller.setup();
}

const int BUFFER_SIZE = 5;
char buf[BUFFER_SIZE];
void loop() {
  if (Serial.available() > 0) {
    int rlen = Serial.readBytesUntil('\n', buf, BUFFER_SIZE);
    controller.sendCommand(buf, rlen);
  }
    
  controller.render();
  delay(50);
}
