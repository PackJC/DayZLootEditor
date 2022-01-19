# DayZ Loot Editor
<p align="center">
  <img src="https://user-images.githubusercontent.com/34726562/148476071-67205782-7264-4bcd-9150-2b6f31e01efb.png" />
 <br>
  A GUI made in Electron to configure DayZ Standalone Loot Tables
  <br>
 Created with Electron powered by Nodejs
</p>

## Reason
It's hard editing loot tables for DayZ. Did you know there are over 20,000 items to adjust values for in the game?
This tool makes it very easy for users to simply search by name for the item they're looking for. Sort items numerically, or alphabetically - both ways you can do with this simple tool.
Once finished editing, simple hit the 'save' button. BAM! You're finished with your servers loot tables - NO MORE CTRL + F each and every time you need to find something, looking through messy lines of XML. 
Hope you enjoy using! :) 



## Usage
The loot table of DayZ (Standalone) is stored in a XML file inside 
this folder: 
<br>`DayZServer\mpmissions\dayzOffline.chernarusplus\db\types.xml`

To start, open the file `types.xml`. This file is your servers loot table. On the first time the file gets saved, a backup file containing the original content with the name `types.xml.original.xml` will be created.

## Installing Project

You must have Nodejs, npm, github, and relevant packages downloaded for the project to work. If you are running the
source code, you must install the developer dependencies. If you are running the executable, then you can simply launcher the application with no further need to installation instruction. Otherwise, follow the directions below.
<br>
1. Move into the directory of the files
`cd dayzlooteditor`
<br>
2. Install all required packages for the project
`npm i .`
<br>
3. Start the project
`npm start`

Electrum window should pop up, this window is the application.
##Developer Dependencies
1) xml2js
2) table-to-json (jQuery Plugin)
3) jQuery
4) bootstrap
5) fs


## Screenshots
![Version 0 612](https://user-images.githubusercontent.com/34726562/149465980-e42794f9-bea0-4ca7-bbc1-0fb9458dc8ba.PNG)



## Recommended Software

 A free program called Fiddle which can be found https://www.electronjs.org/
Fiddle makes it easy to edit projects built with Electronjs. This project was developed using Fiddle and WebStorm. 

## License
  GNU GENERAL PUBLIC LICENSE

