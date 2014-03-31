export TAG_LATEST=`git describe --tags $(git rev-list --tags --max-count=1)`

printenv
