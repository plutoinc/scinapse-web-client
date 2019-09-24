# scinapse.io [![GitHub Starts](https://img.shields.io/github/stars/pluto-net/scinapse-web-client.svg)](https://github.com/pluto-net/scinapse-web-client) [![GitHub contributors](https://img.shields.io/github/contributors/pluto-net/scinapse-web-client.svg)](https://github.com/pluto-net/scinapse-web-client/graphs/contributors/) [![Node version](https://img.shields.io/badge/Node-10-green.svg)](https://nodejs.org/)

[scinapse](https://scinapse.io)'s Web App repository.  


## Getting Started
```
> git clone https://github.com/pluto-net/web-client.git
> npm install
> npm start
```
Then, visit http://localhost:3000 after compiling source code.  

## FAQ for setting local environment
1. I can't access to http://localhost:3000
- If you hadn't ran it before, it could happen because there aren't destination files to serve.  So, just press `ctrl + c` and re-run local server. `npm start`

2. Your npm modules could be stale.
- run `npm install` again, and try to re-run local server `npm start`
- If it doesn't work, remove `node_modules` directory(ex: rm -rf node_modules), and do `npm install` and `npm start`

3. Your branch could be stale.
- pull origin/master branch and re-run local server.


## Behind local server
Local server runs with [Express](https://expressjs.com) and [webpack-dev-server](https://webpack.js.org/).  
Because Scinapse is the [universal rendering](https://medium.com/airbnb-engineering/isomorphic-javascript-the-future-of-web-apps-10882b7a2ebc#.4nyzv6jea) web-app, it needs both server-side app file and client-side app file.  

So, 2 Webpack clients run at the same time for the bundled file of server and client from different entry-point.(You can find this with webpack config files in the root folder.)  

The one for the server just runs in watch mode, then throw results to the dist directory. Then, Express and [Nodemon](https://nodemon.io/) will catch and serve it to http://localhost:3000.  
The other one for the client-side bundle file runs in webpack-dev-server. This webpack serve the results to http://localhost:8080. And our HTML file served from Express server above, has script reference for http://localhost:8080.  

So, When you have changes in code, wait until both server and client build done.  
After build, just refresh the browser tab which is heading for http://localhost:3000/*.  
If there's no error, you can see the result of your code.  

## Running the tests
There are two kinds of the tests.  
First, Unit Tests.  
Second, E2E tests.  

Each has its own running command. If you find separated test command, find `package.json`  file.  
Below is integrated test command which runs both Unit and E2E test.  
```
npm test
```

## Built With
* [ReactJS](https://reactjs.org/)
* [Redux](http://redux.js.org/)
* [TypeScript](http://www.typescriptlang.org/)

## Contributing
If you want to contribute something, just make Pull Request or Issue for us.
we will appreciate all of your contributions. thanks.

### Current Issues
* Clean up source directory structure.
* Assign proper types for Redux Actions and Reducers.
* Missing && Wrong Unit tests.
* Should make more E2E tests.

## Contributors
* **Tylor Shin**(Main director) [GitHub](https://github.com/TylorShin) [Blog](https://tylorsh.in)

* **academey** [GitHub](https://github.com/academey)
* **kimyukyeong** [GitHub](https://github.com/kimyukyeong)
* **woowong** [GitHub](https://github.com/woowong)

## License
Work In Progress.
However, basically this project is licensed under the GPL.

## Acknowledgments

From Apr 2018, We decided to use GitHub's Wiki page for this topic.  
However, belows are valid until now.  

#### Why ReactJS?
ReactJS has had some license problem, but we think it's solved now.
PLUTO's frontend team is used to ReactJS a lot.
But we don't want to any learning burden except blockChain knowledge.

We might need and apply Vue or Angular later(Maybe after Poc).
But React is a pretty good library and we think it's fastest way to develop product at least in our team.

#### Why Typescript?

It's for the benefits from using typed language.

* **Easy to refactoring**
  BlockChain is the bleeding edge area. It means there will be a lot of changes.
  So, DAPPS and other BlockChain applications should be refactored easily and flexibly.

* **Nice to group work**
  In plain Javascript, when you trying to use the function or helpers that made by other team mate, it's very common situation the one is ambiguous.
  We tried to avoid this problem by using typed language.

* **Why not Flow?**
  We also think [Flow](https://github.com/facebook/flow) is much more suitable for React, but PLUTO team is used to TypeScript. And there is not a big problem to use Typescript with React nowadays.
  Until PoC, we won't change neither Typescript nor React.
  But if there is a clear merit to use Angular4 and Typescript, we might migrate to Angular4 after PoC.
