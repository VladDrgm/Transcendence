# cd ./pong_backend
# npm install
# npm start &
# cd ..
# cd ./pong_frontend
# npm install
# npm start
# cd ..

read -p "Do you want to run the backend? (y/n): " runBackend
read -p "Do you want to run the frontend? (y/n): " runFrontend

if [ "$runBackend" == "y" ]; then
  cd ./pong_backend
  npm install
  npm start
fi &

if [ "$runFrontend" == "y" ]; then
  cd ./pong_frontend
  npm install
  npm start
fi
