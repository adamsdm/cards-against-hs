# Cards against humanity
## Made in TDDD27 - Advanced Webbprograming

### About
This is an implementation of the popular party game "Cards against humanity".
The came consists of two pages, one 'host' page and one 'client' page.

The game starts by drawing a black card which contains a sentence with a blank space.
All players have white cards on their hand where each white card contains a word or a sentence.
The players now draw a white card that fits in the blank space of the white card.
The player who makes the funniest sentence (voted by the oter players) wins and gets one point.

### Installation (DEV)
`git clone https://github.com/adamsdm/cards-against.git` - clone the repo
`npm install` - install dependencies
`webpack` - builds the project
`npm run start` - start a (dev)server with hot module reloading

Navigate to the server ip on port 3000 (typically `192.168.0.*:3000`, or `localhost:3000` if on the server computer).
Now to join the game, on a mobile device go to the ip address of the server (typically `192.168.0.*:3000`) and you will be
autodirected to `/client.html`. Enter a username and the roomcode and you've now joined the room. 

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
