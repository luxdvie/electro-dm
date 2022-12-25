# Electro DM

A platform built to facilitate Dungeons & Dragons Dungeon Master tasks with the following goals:
- Build a totally immersive experience that captivates the party.
- Build an experience that seamlessly transitions from one vibe to another.
- Encourage, support, and increase buy-in from party members.
- Make the process of DM'ing more dynamic and easier to reproduce.
- Make it FUN.

** Still in progress as of 12/25/2022 **

# What is it?

It's a Laptop, Bluetooth Speaker, Custom Battle Station (with addressable RGB LEDs), Elgato Stream Deck, Spotify Playlists, Custom Client+Server software, custom sounds, and Phillips Hue Lights.

## Elevator Pitch

Use a soundboard, RGB LEDs, and a tablet to animate D&D actions, indicate player turns, present important player information, drive player engagement while making the process of DM'ing easier, more dynamic, and more fun.

# Platform Components

## Battle Station

Build a custom 36x24" "battle station" to hold [standard battle mats](https://www.amazon.com/gp/product/B085198LF5/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)

Put a micro-controller (ESP8266/Arduino compatible recommend) on the bottom.

Put high-density WS21812B addressable LEDs along the bottom perimeter of the frame. The LEDs show custom animations and track initiative based on where players are sitting.
## Elgato Stream Deck

Use an Elgato Stream Deck to control the following:
- Set Phillips Hue light colors
- Start/stop Spotify Playlists
- Initiate animations on the LED controller

## Electro DM Client + Server Software

This GitHub repository contains two applications - the "client" software and the "server" software.

The server is responsible for communicating between all instances of the applications and talking to the micro-controller.

The client software has a "DM View" for the DM to manage encounters, take notes, and perform other special functions. The client software also has a "Presentation View" intended to be put on an iPad or TV that all players can see. This visually shows the initiative order during battle and other player-facing animations, scenes, and information.

## Sounds + Scripts

### Scripts

In the `scripts` folder you'll find scripts that will be opened using the `System->Open` builtin Elgato function. You can do many things with the scripts but for now all I'm doing is starting/stopping Spotify playlists.

*Note I am using a MacBook so I've only populated `scripts/apple/*.scpt` script files. If you were using Windows, I'm guessing you'd want to use PowerShell scripts instead.

### Sounds

In the `sounds` folder you'll find various audio clips that I've mapped to Elgato Stream Deck keys. This folder may go away long term since it's not a good idea to store large binary files in git.

# Software Architecture

- Frontend: Angular application
  - There is a "DM View" for the DM to take notes and manage encounters and battles
  - There is a "Presentation View" that is meant to be placed on a party-facing iPad or TV that has a visual, ordered display for initiative.
    - More features will be coming soon to the "Presentation View" to build player engagement. Examples: Showing fire when at fire scene, showing important NPC/Point-of-interest information, etc.
- Backend: NodeJS/TypeScript application using [Express](https://expressjs.com/) and [SocketIO](https://socket.io/get-started/chat)

# Getting Started

- Make sure you have or install [NodeJS](https://nodejs.org/en/). I'm using version 16.13.0.
- Download or clone this repository. Extract, and navigate to the root folder.
- Run `npm run setup` to install all dependencies
- Open `shared/src/ElectroDmConfig.ts`
  - Set your computers IP Address to the `IP_ADDRESS` constant value
  - Configure your party's starting players
  - If you're using an LED controller, set the following:
    - Set `NUM_LEDS` to how many LEDs you have
- Run `npm run start` to start the client and server applications
- Navigate to `{{YOUR_IP_ADDRESS}}:4200/dm` to start the DM Client app
- Navigate to `{{YOUR_IP_ADDRESS}}:4200` to start the Presentation Client app

# Bill of Materials

- [Elgato Stream Deck](https://www.amazon.com/gp/product/B06XKNZT1P/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)
- [WS2812 RGB LED Strip (High Density, 144LEDs/m)](https://www.amazon.com/gp/product/B079ZRLMQR/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)
- [5V PSU for LED Strip](https://www.amazon.com/s?k=ws2812+power+supply&ref=nb_sb_noss_1)
- [ESP8266](https://www.amazon.com/gp/product/B07RNX3W9J/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1) or compatible
- Laptop
  - I'm using a MacBook. Any modern device should work fine.
- Speaker
- 36"x24" custom battle-station
  - Cut a 36x24 piece of 1/4" MDF
  - Build a frame around it
  - Place LEDs underneath frame
  - Embed micro-controller underneath frame
  - Connect USB cable from micro-controller to your PC
  - Connect 5V PSU to LED strip

# Contributors

- [Austin Brown](mailto:austinbrown2500@gmail.com)


