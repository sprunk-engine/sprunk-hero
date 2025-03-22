# Sprunk Hero - A sprunk engine example

## Description
This is a [Vite](https://vitejs.dev/) project that aims to a classic instrument based rhythm game in 3d as an end-to-end example for [sprunk](https://github.com/CPNV-ES/game-engine)

## Getting Started

### Prerequisites
* IDE used PhpStorm 2024.2 or Webstorm 2024.2
* npm 10.2+ [official doc](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* node v21+ [official doc](https://nodejs.org/en/download)
* git version 2.39 [official doc](https://git-scm.com/)
* git-lfs/3.5 + [official doc](https://git-lfs.github.com/)
* Google Chrome 130+ (or any other browser that runs WebGPU)

### Run the project
Install packages
```shell
npm install
```
Run vite dev server
```shell
npm run dev 
```

## Deployment
### Build the project
```shell
  npm run build
```
This will generate static files in the `dist` folder.
You can then deploy these files to an any web server.

## Collaborate
### Directory structure
```shell
├───doc                     # Documentation
├───src                     # Source code
│   ├───behaviors           # Behaviors-related code
│   ├───gameobjects         # Custom Game objects (like prefabs, glue behavior and model)
│   │   └───scenes          # Game scenes (root game objects, setting the environment)
│   ├───models              # Models (structures, interfaces, enums)
│   ├───services            # Services used across the application (processing)
│   └───shaders             # Shader files (GLSL)
├───public                  # Web files / assets files
│   └───assets              # Sprunk Engine Asset files (fonts, 3d models, textures)
│       └───fonts           # Font files
```
### Class syntax
The classes are written in order to follow the [Google TypeScript style guidelines](https://google.github.io/styleguide/tsguide.html#classes)

### Workflow
* [Gitflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=Gitflow%20est%20l'un%20des,les%20hotfix%20vers%20la%20production.)
* [How to commit](https://www.conventionalcommits.org/en/v1.0.0/)
* [How to use your workflow](https://nvie.com/posts/a-successful-git-branching-model/)
* Propose a new feature in [Jira](https://ejcpnvprojects.atlassian.net/jira/software/projects/SPR/boards/5/backlog)
* Pull requests are open to merge in the develop branch.
* Release on the main branch we use GitFlow and not with GitHub release.
* When creating a new feature, the branch name must be `feature/SPR-XX-NameOfTheFeature`
* Before merging a feature into develop, the code should be reviewed by one other person (by opening a pull request).
* Issues related to the game engine are added to the [sprunk's github issues page](https://github.com/CPNV-ES/game-engine/issues)
* Issues related to the game are added to the [github issues page](https://github.com/sprunk-engine/sprunk-hero/issues)

## License
Distributed under the MIT License. See LICENSE.txt for more information.

## Contact

* If needed you can create an issue on GitHub we will try to respond as quickly as possible.
