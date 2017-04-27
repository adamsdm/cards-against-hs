# Cards Against Homo Sapiens
## Made in TDDD27 - Advanced Webbprograming

![alt text](https://gitlab.ida.liu.se/adaso578/cards-against/raw/81ecc011a3f6b10906ee9d397a0ca8f0083d7ecc/Banner.png)


### About
This is an implementation of the popular party game "Cards against humanity".

The game starts by drawing a black card which contains a sentence with a blank space.
All players have white cards on their hand where each white card contains a word or a sentence.
The players now picks a white card that fits in the blank space of the white card.
The player who makes the funniest sentence (voted by the oter players) wins and gets one point.

The idea behind this implementation is that the board is showed on a computer, and each player joins in
on their smartphone. 

### Installation
Make sure `node` and `npm` is installed.

* `git clone https://gitlab.ida.liu.se/adaso578/cards-against.git` - clone the repo
* `npm install` - install dependencies
* build the project with 
	* `npm run build:dev` for development
	* `npm run build:prod`for production
* start the server with 
	* `npm run start:dev` for development
	* `npm run start:prod` for production

#### Run in development
Navigate to the server ip on port 3000 (typically `192.168.0.*:3000`, or `localhost:3000` if on the server computer).
To join the game, go to the ip address of the server (typically `192.168.0.*:3000`) and you will be
autodirected to `/client.html`. Enter a username and the roomcode to join the room.

In devmode it's possible to simulate multiple users on machine by starting the server and
navigating to `localhost:3000` to create a room, and in another tab/web-browser go to `localhost:3000/client.html` 
to simulate a mobile device.

### Libraries used
#### Front end
* [React.js](https://facebook.github.io/react/)
* [Immutability-helper](https://github.com/kolodny/immutability-helper) (React addon)

#### Back end
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/)
  
### Build tools
* [Webpack](https://webpack.github.io/) (user with webpack-dev-middleware, webpack-hot-middleware)
* [Babel](https://babeljs.io/)

Data from [JSON Against Humanity](https://www.crhallberg.com/cah/json/)
