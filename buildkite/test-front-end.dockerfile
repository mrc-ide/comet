ARG GIT_ID="UNKNOWN"
FROM mrcide/comet-shared-test-env:$GIT_ID

RUN npm install codecov --global --quiet

CMD npm run test:unit --prefix=app/static && npm run lint --prefix=app/static

ARG CODECOV_TOKEN
RUN if [ $BUILDKITE ] ; then codecov ; fi
