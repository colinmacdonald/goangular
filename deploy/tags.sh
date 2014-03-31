#TRAVIS_COMMIT=5d70fa866b5b7dc1c558e57ae68ba9111b05b809
#TRAVIS_BRANCH=v3.3.22

#TAG_LATEST=`git rev-list --tags --max-count=1`
TAG_EXISTS=`git show-ref --tags --hash | grep -w $TRAVIS_COMMIT | wc -l`
LATEST_TAG=`git describe --tags --exact-match $TRAVIS_COMMIT`

IS_LATEST=false
IS_TAG=false

if [ $TAG_EXISTS != 0 ]; then
  IS_TAG=true
fi

if [ $LATEST_TAG == $TRAVIS_BRANCH ]; then
  IS_LATEST=true
fi

echo "Is tag: $IS_TAG"
echo "Is latest: $IS_LATEST"

echo $TAG_EXISTS
echo $LATEST_TAG

export IS_LATEST
export IS_TAG

#printenv
