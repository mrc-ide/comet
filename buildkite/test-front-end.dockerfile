ARG GIT_ID="UNKNOWN"
ARG CODECOV_TOKEN
FROM mrcide/comet-shared-test-env:$GIT_ID

CMD npm run test:unit --prefix=app/static && npm run lint --prefix=app/static && codecov

