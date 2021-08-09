ARG GIT_ID="UNKNOWN"
FROM mrcide/comet-shared-build-env:$GIT_ID

RUN cd app/static && npx playwright install chromium

CMD ./gradlew app:bootRun & sleep 90 && npm run test:e2e --prefix=app/static
