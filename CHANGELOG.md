# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://github.com/tbessenreither/webconsole/compare/v1.3.3...v1.4.0) (2022-08-10)


### Features

* added data-run attribute to run whatever code is inside the element as a easy way around typing it twice with data-command; ([38b1434](https://github.com/tbessenreither/webconsole/commit/38b14342c766b108c693fcc8aee6e3952516ec7b))
* **WebConsoleAbout:** added about Filme to the list; ([1cc5b88](https://github.com/tbessenreither/webconsole/commit/1cc5b88f08a4776f145c88ccf7a5218b98b26f59))


### Bug Fixes

* removed random test code; ([3d55873](https://github.com/tbessenreither/webconsole/commit/3d558738bf3032f6fcf9f149854558625be4520a))

### [1.3.3](https://github.com/tbessenreither/webconsole/compare/v1.3.2...v1.3.3) (2022-06-07)


### Bug Fixes

* **autocomplete:** fixed another bug in autocomplete overwriting the sliced result if it becomes empty because no common demoninator was found; ([e551b01](https://github.com/tbessenreither/webconsole/commit/e551b016a6ededb82968d2cab00bc4401335a30c))

### [1.3.2](https://github.com/tbessenreither/webconsole/compare/v1.3.1...v1.3.2) (2022-06-07)


### Bug Fixes

* **build:** fixed css control character bug in css and swtiched back to production build; ([8d57441](https://github.com/tbessenreither/webconsole/commit/8d574414b4416e995f169e0e4dc9eac020eea929))

### [1.3.1](https://github.com/tbessenreither/webconsole/compare/v1.3.0...v1.3.1) (2022-06-07)


### Features

* **about:** added more flavour text; ([9833585](https://github.com/tbessenreither/webconsole/commit/98335856742d49b9a13d3cbd265d7022d405c8fe))

## [1.3.0](https://github.com/tbessenreither/webconsole/compare/v1.2.9...v1.3.0) (2022-06-07)


### Features

* **input mode:** added requestInput method that returns a promise with the text that was entered by the user; ([80dd687](https://github.com/tbessenreither/webconsole/commit/80dd6879241296290efc20cccd1eda23e6f54c1f))

### [1.2.9](https://github.com/tbessenreither/webconsole/compare/v1.2.8...v1.2.9) (2022-06-07)


### Bug Fixes

* **command:** fixed issue with boolean arguments; ([b118bf1](https://github.com/tbessenreither/webconsole/commit/b118bf19418676abaf9db6144c5c40a31f7becb0))

### [1.2.8](https://github.com/tbessenreither/webconsole/compare/v1.2.7...v1.2.8) (2022-06-07)


### Features

* added more commands; ([e5f65e9](https://github.com/tbessenreither/webconsole/commit/e5f65e9d95d5b1b3a8427961bcf71d9600aebeab))

### [1.2.7](https://github.com/tbessenreither/webconsole/compare/v1.2.6...v1.2.7) (2022-06-07)


### Features

* rework of plugin integration; ([1f389d8](https://github.com/tbessenreither/webconsole/commit/1f389d88489f646c8ff57270b7e423be7dbc402a))

### [1.2.6](https://github.com/tbessenreither/webconsole/compare/v1.2.5...v1.2.6) (2022-06-07)


### Features

* **help:** added padEnd to command listing and added run command; ([82cf7a8](https://github.com/tbessenreither/webconsole/commit/82cf7a829452541e79392024b0148041eb5ba811))


### Bug Fixes

* **commandHistory:** added getter to console; ([a7f8324](https://github.com/tbessenreither/webconsole/commit/a7f8324beec6827c6e21726a2c0b158291ad38e8))

### [1.2.5](https://github.com/tbessenreither/webconsole/compare/v1.2.4...v1.2.5) (2022-06-06)


### Bug Fixes

* autocomplete now uses clearKey, removed old styling; ([4f295d2](https://github.com/tbessenreither/webconsole/commit/4f295d22ecec2e7727444537e5b4d753474c4252))
* cleanup and bugfixing; ([d0e085b](https://github.com/tbessenreither/webconsole/commit/d0e085bf6e268acc8bb2187bedf1e60175117b03))

### [1.2.4](https://github.com/tbessenreither/webconsole/compare/v1.2.3...v1.2.4) (2022-06-06)


### Bug Fixes

* **about:** removed debug content; ([348233d](https://github.com/tbessenreither/webconsole/commit/348233d751de13678aa94a4fe3b11b2ea67a0378))
* **autocomplete:** fixed bug in autocomplete subcommand detection; ([7961ce6](https://github.com/tbessenreither/webconsole/commit/7961ce65ced3f6ed138fdded565401c47ca362f2))
* **build:** made build use npm script instead of npx webpack; ([285bc3c](https://github.com/tbessenreither/webconsole/commit/285bc3cdebe171809f544c71cf5164d868610712))

### [1.2.3](https://github.com/tbessenreither/webconsole/compare/v1.2.2...v1.2.3) (2022-06-06)


### Features

* **autocomplete:** added autocomplete on tab including search in plugins, moved command from type to class; ([dcd5d91](https://github.com/tbessenreither/webconsole/commit/dcd5d910d6456caba7a2d8e816f620b646622e48))

### [1.2.2](https://github.com/tbessenreither/webconsole/compare/v1.2.1...v1.2.2) (2022-06-06)


### Features

* **otter:** random otter ([2b17c46](https://github.com/tbessenreither/webconsole/commit/2b17c46becf7236a0ffa082a9e1f81ca384e1ea8))
* **ts:** timestamp converter; ([cf9de0a](https://github.com/tbessenreither/webconsole/commit/cf9de0ab9a670fef039dfd4a71132f16c8df4a12))


### Bug Fixes

* added more help text; ([e75ac6a](https://github.com/tbessenreither/webconsole/commit/e75ac6a7310f83c78ae391522214caf9f709dd95))

### [1.2.1](https://github.com/tbessenreither/webconsole/compare/v1.2.0...v1.2.1) (2022-06-06)


### Features

* added nofocus data attribute; ([820ff9b](https://github.com/tbessenreither/webconsole/commit/820ff9b42a1b0a4b8fa41733de0eb05c529bb0a2))
* **Otter:** added otter ascii art ([649b11f](https://github.com/tbessenreither/webconsole/commit/649b11fa2b6f4dae9740967efb077301f7814f9a))

## [1.2.0](https://github.com/tbessenreither/webconsole/compare/v1.1.3...v1.2.0) (2022-06-06)


### Features

* **games:** added tictactoe board; ([0ae15ec](https://github.com/tbessenreither/webconsole/commit/0ae15ecf620194eb3250e2ecf39ba8d430bde7c4))


### Bug Fixes

* **core:** added history to myCommands; ([11ae999](https://github.com/tbessenreither/webconsole/commit/11ae99955ba46f887cc27f6eeee1194bfefccdb7))

### [1.1.3](https://github.com/tbessenreither/webconsole/compare/v1.1.2...v1.1.3) (2022-06-06)


### Features

* **tools:** added tools class with json function; ([2ec16e4](https://github.com/tbessenreither/webconsole/commit/2ec16e466f074d17e7d4f8e176d8b2e2bdae6da8))


### Bug Fixes

* **focus:** focus now only happens when no text is clicked; ([3092fe6](https://github.com/tbessenreither/webconsole/commit/3092fe6e59547731d44b25a7f888eb75c690e47d))

### [1.1.2](https://github.com/tbessenreither/webconsole/compare/v1.1.1...v1.1.2) (2022-06-06)


### Bug Fixes

* **init:** removed debug output now that wrapping does work; ([3f20722](https://github.com/tbessenreither/webconsole/commit/3f207223ff03ca84acdf2b86191168b193e1fd88))

### [1.1.1](https://github.com/tbessenreither/webconsole/compare/v1.1.0...v1.1.1) (2022-06-06)


### Bug Fixes

* **style:** removed rocket from commands. ([7691e4f](https://github.com/tbessenreither/webconsole/commit/7691e4fd014df39cfbfacb4f81c458c775630914))

## [1.1.0](https://github.com/tbessenreither/webconsole/compare/v1.0.2...v1.1.0) (2022-06-06)


### Features

* **commandHistory:** added command history and history function; ([7ed8bb6](https://github.com/tbessenreither/webconsole/commit/7ed8bb616221f05efaeaa93c2f927f3777500982))

### [1.0.2](https://github.com/tbessenreither/webconsole/compare/v1.0.1...v1.0.2) (2022-06-06)


### Bug Fixes

* **styling:** added icon to commands and made not implemented responses a warning; ([853cdfd](https://github.com/tbessenreither/webconsole/commit/853cdfd153aeaea1107d7ab09df4ea4ded5b137d))

### 1.0.1 (2022-06-06)
