ARG GIT_ID="UNKNOWN"
FROM mrcide/comet-shared-test-env:$GIT_ID

COPY ./src/app/static/playwright.docker.config.ts /comet/src/app/static/playwright.config.ts

RUN cd app/static && npx playwright install chromium

CMD npm run test:e2e --prefix=app/static
