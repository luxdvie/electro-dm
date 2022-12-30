# Electro DM

For Dungeons & Dragons, for Dungeon Masters, for players:

Use a NodeJS server and Angular frontend application combined with a soundboard, RGB LEDs, and a tablet to animate D&D actions, indicate player turns, present important player information, drive player engagement while making the process of DM'ing easier, more dynamic, and more fun.

## To see details on installing and running, see [Getting Starting](./docs/GettingStarted.MD).

# What is it?

This is a platform that starts with a laptop running NodeJS and Angular apps. From there, we add the following components to build an immersive D&D experienced.

- Laptop facing the DM
- iPad, TV, or other web device facing the Players
- Loud speaker connected to laptop
- Spotify Playlists, Sound Effects
- Phillips Hue Lights (optional)
- Elgato Stream Deck (optional)
- Custom Battle Stations with RGB LEDs (optional)

# Platform Components

## Custom Battle Station

This is a custom 36x24" "battle station" to hold [standard battle mats](https://www.amazon.com/gp/product/B085198LF5/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)

See [Hardware Instructions](./docs/HardwareInstructions.MD) for details.

## Elgato Stream Deck

Use an Elgato Stream Deck to control the following:
- Set Phillips Hue light colors
- Start/stop Spotify Playlists
- Initiate animations on the LED controller

See the `/elgato-profile` folder for the Stream Deck Profiles.

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

see [Getting Starting](./docs/GettingStarted.MD).

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


