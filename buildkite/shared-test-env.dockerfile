FROM vimc/node-docker-openjdk:master

# Setup gradle
COPY ./src/gradlew /comet/src/
COPY ./src/gradle /comet/src/gradle/

WORKDIR /comet/src
RUN ./gradlew

# Pull in dependencies
COPY ./src/settings.gradle /comet/src/
COPY ./src/gradle.properties .
COPY ./src/app/build.gradle.kts app/

RUN ./gradlew

# Install front-end dependencies
COPY ./src/app/static/package.json /comet/src/app/static/package.json
COPY ./src/app/static/package-lock.json /comet/src/app/static/package-lock.json
RUN npm ci --prefix=app/static

# Copy source
COPY . /comet
COPY ./src/config/ /comet/src/config/
COPY ./src/app/src/main/resources/docker-config.properties /comet/src/app/src/main/resources/config.properties
RUN ./gradlew :app:compileKotlin

# Install codecov
RUN npm install codecov --global --quiet

