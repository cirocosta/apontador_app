# Injetador

> Naively reloads browsers and injects stuff

![Injetador Monster](http://i.imgur.com/6fUHVC3.png)

## Usage

Very often i want to see changes that i'm doing across other browsers. With *Injetador* you are fully able to do that :neckbeard:

**Install it** with:

```bash
$ npm install -g injetador
```

and then **run** it with:

```bash
$ injetador
```

### Reload multiple browsers on file changes

![Injetador Working](http://i.imgur.com/zmDOKNt.gif)

Specify a *webpage* and a *directory*. Go to `localhost:3000` and then change a file from that *dir*. It will reload the page across all browsers at *localhost:3000*.

### Reload multiple browsers on changes and inject js/css there

Just like the above, but now you are able to specify a *js* file and a *cssfile*, which will then be injected when the page finishes its loading process.

### Arguments

Here are the arguments that you are able to specify when initializing Injetador. You are not required to use as Injetador provides a familiar Q&A interface.

|    arg    |                        description                         |
| --------- | ---------------------------------------------------------- |
| --webpage | the webpage which will be proxied to our the local server  |
| --dir     | the directory where your awesome stuff lives (relative)    |
| --watch   | watches the specified *dir* and reloads the page when that |
|           | happens.                                                   |
| --jsfile  | determines the js file to inject (relative to --dir)       |
| --cssfile | determines the css file to inject (relative to --dir)      |
| --port    | the port that injetador will use                           |


> only lazy programmers will want to write the kind of tools that might replace them in the end. Only a lazy programmer will avoid writing monotonous, repetitive code.


**MIT License**
