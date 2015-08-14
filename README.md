# Laravel Elixir Bower Files

Bower component folders should not be placed in your application's public folder. To solve this problem, this package defines a set of Laravel Elixir's tasks to publish fonts, images, and javascript files from your bower components to a given folder.
It also defines a task that generates a `requirejs` main file from the published javascript files.

Please note that this package uses `bower-files` to parse the packages installed through `bower`. 

## Installation

First you need to install this package.

```sh
npm install --save-dev laravel-elixir-bower-files
```

Then require this package into your `gulpfile.js`.

```js
var Elixir = require('laravel-elixir');
require('laravel-elixir-bower-files');
```

## Publishing fonts

To publish fonts simply call the `bowerFonts` method from your mix.

This method takes the files with `.svg`, `.woff`, `.woff2`, `.ttf` and `.eot` file extensions and places them on the destination folder. Fonts are grouped in a folder named the same as the package they belong to.
For example, Font Awesome's font files, would be placed in a folder named `font-awesome` inside the destination folder.

The `bowerFonts` method can take up to two arguments, both optional, the first one being the output folder (which defaults to `public/fonts`), and the second one being an options object passed to the `bower-files` constructor.

Sample code:

```js
Elixir(function(mix) {
    mix.bowerFonts('public/webfonts', {camelCase: false});
});
```

## Publishing images

To publish images simply call the `bowerImages` method from your mix.

This method takes the files with `.gif`, `.jpg`, `.jpeg` and `.png` file extensions and places them on the destination folder. Images are grouped in a folder named the same as the package they belong to.
For example, Chosen's image files, would be placed in a folder named `chosen` inside the destination folder.

The `bowerImages` method can take up to two arguments, both optional, the first one being the output folder (which defaults to `public/img/vendor`), and the second one being an options object passed to the `bower-files` constructor.

Images published in this fashion are passed through an imagemin task for optimization.

Sample code:

```js
Elixir(function(mix) {
    mix.bowerImages('public/img/vendor', {camelCase: false});
});
```

## Publishing javascript files

To publish javascript files simply call the `bowerJs` method from your mix.

This method takes the files with `.js` file extensions and places them on the destination folder. Whenever a package contains more than one main javascript file, they will be grouped in a folder named the same as the package they belong to. Whenever a package contains only one main javascript file, the javascript file will be renamed to the package name.

The `bowerJs` method can take up to two arguments, both optional, the first one being the output folder (which defaults to `resources/assets/js/vendor`), and the second one being an options object passed to the `bower-files` constructor.

Javascript files published in this fashion are passed through an uglify task for optimization, whenever the package contains a minified version of the script, this task is skipped.

Sample code:

```js
Elixir(function(mix) {
    mix.bowerJs('publis/js/vendor', {camelCase: false});
});
```

The reason why javascript files are not concatenated togheter, is because the main focus of this task is to flatten file structure in order to simplify their use in other tasks, or to simplify their use with other libraries such as `requirejs`.

## Generating a requirejs main file

To generate a requirejs main file, simply call the `bowerRequireMain` method from your mix. This method should be chained after the `bowerJs` method.

This method takes all the files proccessed by the `bowerJs` task, and generates a requirejs main file.

The `bowerRequireMain` method can take up to three arguments, the last two optional, the first one being the name of the file to generate, the second being the `shim` definitions for your packages, the third one being the output folder (which defaults to `resources/assets/js`).

```js
Elixir(function(mix) {
    // call only on development environment
    if (!Elixir.config.production) {
        mix.bowerJs()
            // Chain this method after calling bowerJs
            .bowerMain('main.js', {'angular':{'exports':'angular'}, ...}, 'resources/assets/js');
    }
});
```

## Comments

You may notice there are no tasks for publishing css files, this is because they should be included in the build process, althoug I will write a task for it in the future.

## To-dos

  - Allow further personalization through parameters to all the methods.
  - Write a task that concatenates all javascript files.
  - Adding the posibility to ignore one or more packages.
  - Adding the posibility to only parse one or more packages.
  - Write tests. (Yes, I realize I should have wrote them before).

License
----

MIT

