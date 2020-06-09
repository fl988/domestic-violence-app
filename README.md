# domestic-violence-app

For Android Phone Users
- Download the Expo client app
	- https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_AU
- Next open the Expo client app then use the QR code scanner and scan the QR code on this link 
	- https://expo.io/@febbelicious/domestic-violence-app

For iOS Phone Users
- Download the Expo client app
	- https://apps.apple.com/au/app/expo-client/id982107779
- Due to restrictions on Apple we wont be able to use the QR code that is provided on the previous link. It's only available to Android users.
- We will instead do it on a Mac computer. Follow the steps below.
	
For Windows
- Download and install the following softwares
	- Microsoft Visual Studio Code (https://code.visualstudio.com/)
	- Node.js version => v12.16.3 (https://nodejs.org/en/)
	- Node Package Manager (NPM) version => 6.14.5
	- GitHub
- Unzip the domestic-violence-alpha-master.zip on your directory of choice.
- Open VS code and open a new terminal ( CTRL + SHIFT + ` )
- On the terminal cd in to that unzipped folder. eg: cd C:/<User>/domestic-violence-master
	- The structure of the folder will look like => "domestic-violence-app-master/domestic-violence-master"
- Once inside the folder "domestic-violence-master", on terminal type "npm install", this will install all the node modules of the project.
- When everything is installed, type "npm start" or "expo start". This will launch expo on browser and will then display a QR code which can be scanned by your expo client app on your phone.

For Mac
- Download and install the following softwares
	- Microsoft Visual Studio Code (https://code.visualstudio.com/)
	- Node.js version => v12.16.3 (https://nodejs.org/en/)
	- Node Package Manager (NPM) version => 6.14.5
	- GitHub
- Then follow instructions here: https://reactnativecode.com/install-react-native-on-mac/
	- Stop on Step 5 because this is optional if you want an iOS simulator on your Mac, this is about 6gb - 9gb. Instead we will use the Expo Client App on your iPhone.
	- Do not follow Step 6 onwards.
	
- Unzip the domestic-violence-alpha-master.zip on your directory of choice.
- Open VS code and open a new terminal.
- On the terminal, go to the unzipped folder.
- Once inside the folder type "npm install", this will install all the node modules of the project.
- When everything is installed, type "npm start" or "expo start". This will launch expo on browser and will then display a QR code which can be scanned by your expo client app on your phone.

Alternatively we can clone this instead on VS code
- git clone https://github.com/fl988/domestic-violence-app.git
- go inside the folder "domestic-violence-app" where all the configuration files are located for npm usage.
- npm install
- npm start

NOTE: These are the important versions that will work with the app. To check installed versions type eg: "npm list expo", "npm list expo-cli", "npm list react-native"
- expo@37.0.11 
- expo-cli@3.20.1 
- react-native@0.61.4 
