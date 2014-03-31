TAG_EXISTS=`git show-ref --tags --hash | grep -w $TRAVIS_COMMIT | wc -l`
BRANCH_IS_TAG=`git tag --points-at $TRAVIS_COMMIT | grep -w $TRAVIS_BRANCH | wc -l`
LATEST_TAG=`git describe --tags --exact-match $TRAVIS_COMMIT | grep -w $TRAVIS_BRANCH | wc -l`

IS_LATEST=false
IS_TAG=false

if [ $TAG_EXISTS != 0 ] && [ $BRANCH_IS_TAG != 0 ]; then
  IS_TAG=true
fi

if [ $LATEST_TAG != 0 ]; then
  IS_LATEST=true
fi

echo "Is tag: $IS_TAG"
echo "Is latest: $IS_LATEST"

echo $TAG_EXISTS
echo $LATEST_TAG
echo $BRANCH_IS_TAG

export IS_LATEST
export IS_TAG

#printenv
