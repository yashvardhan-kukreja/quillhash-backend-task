CURRENT_BUILD_TAG=$ENV_BUILD_TAG
if [ ! $CURRENT_BUILD_TAG ]
  then
    CURRENT_BUILD_TAG="latest"
fi
if [[ $(docker container ps --format {{.Names}} | grep "^quillhash-container\$") ]]
  then
    docker container stop quillhash-container
    docker container rm quillhash-container
elif [[ $(docker container ps -a --format {{.Names}} | grep "^quillhash-container\$") ]]
  then
    docker container rm quillhash-container
fi
docker run -d -p 8000:8000 --name quillhash-container yashvardhankukreja/quillhash:$CURRENT_BUILD_TAG
