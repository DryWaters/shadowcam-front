# ShadowCam FrontEnd Application
ShadowCam frontend application that uses 
[PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) to 
determine user's poses to record user's boxing workouts.  It requires the  
[backend](https://github.com/DryWaters/shadowcam-back)
companion Express application for user authentication and for saving
of user's data.

* [Instructions](#instructions)
* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Built With](#built-with)
* [Contributing](#contributing)
* [Example](#example)
* [Authors](#authors)

## Instructions

1. Install NPM Packages using ``` npm install ```
2. Run with ``` npm start ```

ShadowCam backend application is required to be running for the 
application to run successfully.  It uses the backend API application
for user authentication/creation and for creating and saving new
workouts.

## Getting Started
All needed NPM packages are included in the package.json file. 

## Prerequisites
All needed NPM packages are included in the package.json file.

1. Modern laptop/desktop with a webcam.
2. ShadowCam backend application.
3. Internet connection to download PoseNet model.

## Built With
[React](https://reactjs.org/)

[PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet)

and other great NPM packages.  See package.json for full list.

## Contributing
Feel free to fork into your own repo to add additional features.

## Example
As of this writing an example of the application can be located at:

Frontend Application
https://shadow-cam.firebaseapp.com/

Backend Application
https://shadowcam-back.herokuapp.com/

## Authors
[Daniel Waters](https://www.watersjournal.com)

[Dan Rachou](https://github.com/danrachou)

