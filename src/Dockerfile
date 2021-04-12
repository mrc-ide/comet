FROM vimc/node-docker-openjdk:master AS build

RUN npm install codecov --global --quiet

WORKDIR /app/src

COPY gradlew .
COPY gradle gradle
COPY settings.gradle .
COPY gradle.properties .
COPY config config
COPY app/build.gradle.kts app/
RUN ./gradlew --quiet --no-daemon

COPY app/static/package.json app/static/
COPY app/static/package-lock.json app/static/
RUN npm ci --prefix=app/static/ --quiet

COPY . .

FROM build AS test

RUN ./gradlew :app:detektMain :app:test :app:jacocoTestReport --no-daemon
RUN npm run lint --prefix=app/static/ && npm run test:unit --prefix=app/static/
ARG BUILDKITE
ARG BUILDKITE_BRANCH
ARG BUILDKITE_BUILD_NUMBER
ARG BUILDKITE_JOB_ID
ARG BUILDKITE_BUILD_URL
ARG BUILDKITE_PROJECT_SLUG
ARG BUILDKITE_COMMIT
RUN if [ $BUILDKITE ] ; then codecov ; fi

FROM build AS dist

RUN ./gradlew :app:bootDistTar --quiet --no-daemon
RUN tar xf app/build/distributions/app-boot.tar -C /

FROM openjdk:8u282-jre-slim

COPY --from=dist /app-boot /app-boot
ENTRYPOINT ["/app-boot/bin/app", "--spring.profiles.active=prod"]
