# scinapse.io
[scinapse](https://scinapse.io)'s Web App repository.  

## Getting Started
```
git clone https://github.com/pluto-net/web-client.git
npm install
npm start
```

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
