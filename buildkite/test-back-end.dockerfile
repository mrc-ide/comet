ARG GIT_ID="UNKNOWN"
ARG CODECOV_TOKEN
ENV CODECOV_TOKEN=$CODECOV_TOKEN

FROM mrcide/comet-shared-test-env:$GIT_ID

# Test app
CMD ./gradlew :app:detektMain :app:test :app:jacocoTestReport && codecov -p .. -f app/coverage/test/*.xml
