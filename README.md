# cuttle-front-vue
This repository is the front end web app for [Cuttle](https://www.pagat.com/combat/cuttle.html), the pvp card game, built in VueJs using Vuetify. It must be run in tandem with the [back end web server](https://github.com/TeasingSisyphus/cuttleV2), built with SailsJs.

To play the game you will need to boot both the front & back end servers, then navigate to `localhost:8080` in your browser of choice.
## Project setup
### Download nodeJs
[nodeJs](https://nodejs.org/en/) lets you create & run web servers in javascript (along with other fancy system-level stuff not needed for this project). Both this repository & the [back end]((https://github.com/TeasingSisyphus/cuttleV2)) depend on node as the main system-wide dependency. The download comes with npm (node package manageer) which you'll use to install the project-specific dependencies.

**You should install version 14.xx.xx** (Left-side download) as this is the latest **stable** version.

**NOTE** When running on your local computer, signup/login only stores credentials on your computer and in memory. Shutting down the server wipes the in-memory database along with all game & account data.

### Front End Setup
#### Download Front-End Code
##### Using git
```
git clone https://github.com/itsalaidbacklife/cuttle-front-vue
```
##### Or [Download](https://github.com/itsalaidbacklife/cuttle-front-vue/archive/refs/heads/main.zip) as .zip
#### Install Front-End Dependencies
Open a terminal in the root directory of this project and run
```
npm install
```

#### Boot Front-End server
```
npm run serve
```

#### Open in broswer
Navigate to [localhost:8080](http:localhost:8080) in your browser of choice.

You should see the Login page, but you won't be able to login until you boot the back end (see below)
#### (Optional) Play on local wifi network
To configure for play on your local wifi network, find your local ip address, then create a new file in the root folder of the front-end (this) repo called `.env.local` and add this one line to it:
```
VUE_APP_API_URL=<your-local-ip>:1337
```
Then you can open your browser in any other device on the same network to `<your-local-ip>:8080` to play on that device.

#### Commands for development
##### Compiles and minifies for production
```
npm run build
```

##### Lints and fixes files
```
npm run lint
```


### Back End Setup
#### Download Back-End Code
##### Using git
```
git clone https://github.com/TeasingSisyphus/cuttleV2
```
##### Or [Download](https://github.com/TeasingSisyphus/cuttleV2/archive/refs/heads/main.zip) as .zip
#### Install Back-End Dependencies
cd into root folder of back-end and run
```
npm install
```
#### Boot Back-End server
```
npm start
```
Once the front & back-ends are booted, you can play the game in your browser at `localhost:8080`

### Shutting down
You can shut down the servers by hitting `ctrl + c` several times from the terminal windows they are running in. Shut down both servers to completely delete all game & account data.