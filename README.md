# comet

Comet is a web application which provides access to CovidSim model results using [cometr](https://github.com/mrc-ide/cometr)

## Getting started

```shell
npm install --prefix=src/app/static/
./scripts/run-dev-dependencies.sh
src/gradlew -p src :app:bootRun
```

Then visit http://localhost:8080/

If you use "Rebuild project" in IntelliJ then there is no need to restart the app after making changes to Kotlin code

For automatic recompilation of TypeScript code you can additionally run:

```shell
npm run watch --prefix=src/app/static/
```

Run `scripts/clear-docker.sh` to tear down all docker dependencies. Alternatively, use `scripts/run-dev-dependencies.sh`
and use `Ctrl-C` to stop dependencies. 

## Other build targets

Kotlin lint/test:

```shell
src/gradlew -p src :app:detektMain
src/gradlew -p src :app:test
```

TypeScript lint/test:

```shell
npm run lint --prefix=src/app/static/
npm run test:unit --prefix=src/app/static/
```
