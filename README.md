# tornikeo.com

The shadcn interface uses the stock Nova preset with Base UI. Jekyll renders the pages and archives. Vite builds the interface assets and the build-time shadcn renderer from `ui/`. The published HTML already contains the shadcn layout, and the browser loads the interactive gallery and image tools on demand.

With Node.js 22 and the site’s Ruby gems installed, run:

```sh
JEKYLL_ENV=production bin/build-shadcn-site
```

The combined build writes the deployable static site to `_site/`. Pass Jekyll build options, such as `--destination`, after the command.

## About the original Jekyll template

# tornikeo.com

My [website](https://tornikeo.com/) is built from this repository. 

## Setup

Using [docker](https://www.docker.com/):

```sh
docker compose up --build
```

View the website at [http://localhost:4000](http://0.0.0.0:4000)

