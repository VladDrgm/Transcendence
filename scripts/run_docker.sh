cd ./pong_backend
echo "Installing backend dependencies"
npm install
cd ..
cd ./pong_frontend
echo "Installing frontend dependencies"
npm install
cd ..

echo Preparing to run docker build ...
sleep 5
echo Running docker build...
docker-compose up --build