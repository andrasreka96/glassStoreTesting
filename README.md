# glassStoreTesting
Simple model of a glass purchase, created with the purpose of learning software testing

# Development
## Environment prerequisites
* [Node 8.9+](https://nodejs.org/en/download/) and [NPM 5.5.1+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.
* Angular installed. To install it globally on your machine run the following command: `npm install -g @angular/cli`

## Running the project
First install the dependencies: `npm install` (the `node_modules` directory should appear in the project root).

Run the `npm run start` command from the angular app main folder.
The application now runs on http://localhost:4200/, and can be viewed from a browser.

## Running the tests
Run the `ng test` command from the angular app main folder.

The `ng test` command builds the app in watch mode, and launches the [Karma test runner](https://karma-runner.github.io/latest/index.html).
Upon changes on the test file(s) the tests are re-run and the browser window refreshes.
