# Getting Started

This document covers details for installing and running the application.

# Prerequisites

- Install [NodeJS](https://nodejs.org/en/).
  - I'm using version 16.13.0.
- Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- Install [Visual Studio Code (VSCode)](https://code.visualstudio.com/) or your preferred code editor.

If you plan to use the (optional) RGB LEDS with your setup, see [Hardware Getting Started](./HardwareGettingStarted.MD)

# Installing + Running

1. Clone this repository by executing this command in your terminal:
```
$ git clone https://github.com/luxdvie/electro-dm.git
```
2. Navigate to the directory
```
$ cd electro-dm
```
3. Run `npm run setup` to setup the project
4. Open the whole folder in Visual Studio Code
   1. Open Visual Studio Code
   2. Go to `File -> Open Folder` and open the folder that Git just cloned
5. Open `shared/src/ElectroDmConfig.ts`
   1. Set your computers IP Address to the `IP_ADDRESS` constant value
   2. Configure your party's starting players
   3. If you're using an LED controller, set the following:
    - Set `NUM_LEDS` to how many LEDs you have
- Run `npm run start` to start the client and server applications
- Navigate to `{{YOUR_IP_ADDRESS}}:4200/dm` to start the DM Client app
- Navigate to `{{YOUR_IP_ADDRESS}}:4200` to start the Presentation Client app
