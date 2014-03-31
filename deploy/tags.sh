#TRAVIS_COMMIT=9bcfe87f6805b4783439205e2d15e98f295d9e21
#TRAVIS_BRANCH=v3.3.15

TAG_LATEST=`git rev-list --tags --max-count=1`
TAGS_HASH=`git show-ref --tags --hash`
TAGS_HAS_HASH=`grep -q -w $TRAVIS_COMMIT <<<$TAGS_HASH`
POINTS_TO_TAG=`git tag --points-at $TRAVIS_COMMIT`

IS_LATEST=false
IS_TAG=false

# Check if commit hash exists in list of tag hashes
# and the tag points to the TRAVIS_COMMIT
if [ $TRAVIS_BRANCH == "$POINTS_TO_TAG" ] && $CONTAINS_HASH; then
  IS_TAG=true
fi

# Check if latest tag hash matches the commit hash
if [ $TAG_LATEST == "$TRAVIS_COMMIT" ]; then
  IS_LATEST=true
fi

echo $IS_LATEST
echo $IS_TAG

export IS_LATEST
export IS_TAG
export TRUE=true
export FALSE=false
export TEST=work

printenv
