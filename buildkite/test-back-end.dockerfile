ARG GIT_ID="UNKNOWN"
FROM mrcide/comet-shared-test-env:$GIT_ID

# Test app
CMD ./gradlew :app:detektMain :app:test :app:jacocoTestReport
