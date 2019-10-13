# COSC560 Project - Sequence

### Creator:
J.Crowley
220202294

### URL
[http://turing.une.edu.au:50135](http://turing.une.edu.au:50135)


## Details
This project recreates the boardgame Sequence through a web application. 

For rules please goto [here](https://en.wikipedia.org/wiki/Sequence_(game)).

Vue.js has been used for the frontend framework and d3.js for tthe statistics page. Express.js was used for the server backend implementation.
Other technologies include:
Babel - for the development of the frontend applications using ES6 and converting back to ES5
Webpack - For the compilation and minifying of static frontend assets.
Nodemon - Used for the monitoring and hot-reloads of files during development.



## Build or Rebuild
This project is split up into 3 parts:
The game frontend, stats page frontend and the server. The dev code for each is contained in sequence/, stats/ and server/ directories respectively. 

As such building of the project from these directories is a three part process. 	__**underline bold**__ To build for production the following needs to be done in this exact order.	__**underline bold**__ This also assumes that a running mongod service is a available on the default port (27017) with the required database particulars matching that contained within the server backend .js files.

### 1. Build the game fronted
Navigate to the game frontend directory (sequence/) within a terminal and enter the following
```
npm install
npm run build
```
These commands will compile this part of the project to server/public


### 2. Build the stats page
Navigate to the stats page directory (stats/) within a terminal and enter the following
```
npm install
npm run build
```
These commands will compile this part of the project to server/public/stats/


### 3. Start the server
From the sequence-project directory enter the following command
```
npm install
npm run start
```
The terminal will output the port that the server is running on (50135 by default). 



# All Commands


## Game Frontend

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
This server will run on port 8080 by default. To have full functionality an instance of the server project will need to be running also. 

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## Stats Page

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```
This will compile to the server/public/stats folder each time. To access the stats single page app in this mode, start the backend server, open a browser and navigate to its base url (incuding port if not 80) followed by "/stats/". The page should load. 

### Compiles and minifies for production
```
npm run build
```

### Lints and reports only
```
npm run lint
```

### Lints and fixes problems inplace (where possible)
```
npm run fix
```



## Server Backend

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and runs for production
```
npm run start
```

