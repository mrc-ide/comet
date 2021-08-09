ARG GIT_ID="UNKNOWN"
FROM mrcide/comet-shared-build-env:$GIT_ID

CMD npm run test:unit --prefix=app/static && npm run lint --prefix=app/static
