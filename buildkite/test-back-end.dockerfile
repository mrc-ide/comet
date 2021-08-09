ARG GIT_ID="UNKNOWN"
FROM mrcide/comet-shared-build-env:$GIT_ID

# Test app
CMD ./gradlew :app:detektMain :app:test :app:jacocoTestReport
