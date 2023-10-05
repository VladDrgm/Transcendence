cd ./pong_backend
echo "Installing backend dependencies"
npm install
cd ..
cd ./pong_frontend
echo "Installing frontend dependencies"
npm run build
cd ..
