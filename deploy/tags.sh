TRAVIS_COMMIT=30f64e18673814ec16e4dc382c2678526e71c93c

TAG_LATEST=`git rev-list --tags --max-count=1`
TAGS_HASH=`git show-ref --tags --hash`

IS_LATEST=false
IS_TAG=false

# Check if latest tag hash matches the commit hash
if [ $TAG_LATEST == "$TRAVIS_COMMIT" ]; then
  IS_LATEST=true
fi

# Check if commit hash exists in list of tag hashes
if `grep -q -w $TRAVIS_COMMIT <<<$TAGS_HASH`; then
  IS_TAG=true
fi

echo $IS_LATEST
echo $IS_TAG

export IS_LATEST
export IS_TAG
