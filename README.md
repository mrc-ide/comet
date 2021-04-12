# comet

## Getting started

```shell
npm install --prefix=src/app/static/
src/gradlew -p src :app:bootRun
```

Then visit http://localhost:8080/

If you use "Rebuild project" in IntelliJ then there is no need to restart the app after making changes to Kotlin code

For automatic recompilation of TypeScript code you can additionally run:

```shell
npm run watch --prefix=src/app/static/
```

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
