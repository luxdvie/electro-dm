# Hardware Instructions

This document shows you how to build the battle station and install the micro-controller and RGB LEDs onto it.

# Requirements

- 36"x24" sheet of 1/4" MDF
- Enough 1x2 material to make a frame around the MDF
- About 8' of RGB LEDs in strips
- ESP8266 micro-controller
- 6' USB 2.0 A-Micro cable
- 5v PSU for LEDs - at least 3A

# Step 1 - Building the Frame

1. Obtain or cut a 36"x24" sheet of 1/4" MDF
2. Lay it on your work surface
3. Build a simple frame around the MDF
4. Use a few scrap pieces of wood to hold the MDF in place (see pictures)

# Step 2 - Installing the Electronics

1. Secure the ESP8266 controller on one of the short edges of the frame
   1. *Note this will end up facing you (the DM) during play, so it can connect to your laptop
2. Secure the RGB LED strips in place
   1. **Important** Make sure the arrows are pointing away from the micro-controller
   2. The signal on WS2812 goes in one direction only
   3. See image:
3. Solder and connect jumper wires to form the 90 degree turns
4. Place LEDs on both long edges of the frame and the further short edge
   1. *Note since the short edge facing you contains the micro-controller and DM shield, there's no point in putting LEDs on that short face
5. Connect the "Signal" from the LED strip to the D6 Pin on the ESP8266
6. Connect the "Ground" from the LED strip to the GND Pin on the ESP8266
7. Connect a 5v Pigtail to the 5v and Ground Pin on the WS2812.

When you're done, it should look like this:\
*see image*

# Step 3 - Flashing

These instructions assume you're using an ESP8266.

1. Download the [Arduino IDE](https://www.arduino.cc/en/software)
2. Install the ESP8266 boards library. [Instructions here](https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/)
3. Open the `/arduino/Arduino/Arduino.ino` file in the Arduino IDE
4. Following the instructions from Step 2, flash the program to the ESP8266

# Step 4 - Testing

You're done now, but to test that everything is working properly, run the software (See [Getting Started](./GettingStarted.MD)).
