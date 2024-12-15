# Start the backend server in the background
cd backend
go run . &
BACKEND_PID=$!

# Start the frontend server in the background
cd ../frontend
npm init
npm run start &
FRONTEND_PID=$!

# Wait for both servers
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
wait $BACKEND_PID $FRONTEND_PID

kill $BACKEND_PID $FRONTEND_PID
