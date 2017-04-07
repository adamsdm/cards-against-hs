# Cards against humanity
## Made in TDDD27 - Advanced Webbprograming

### About
This is an implementation of the popular party game "Cards against humanity".
The came consists of two pages, one 'host' page and one 'client' page.
To start the game, a user (on a computer) creates a room with a random four character roomcode.
Clients can then join this room by going to "/client.html" on their mobile devices.
The computer works as the gameboard, and the mobile devices is used to submit, 
and vote on other players cards.

### Installation (DEV)
`git clone https://github.com/adamsdm/cards-against.git` - clone the repo
`npm install` - install dependencies
`webpack` - builds the project
`npm run start` - start a (dev)server with hot module reloading

Navigate to the server ip on port 3000 (typically 192.168.0.*:3000, or localhost:3000 if on the server computer).
Now to join the game, on a mobile device go to the ip address of the server (typically 192.168.0.*:3000) and you will be
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
