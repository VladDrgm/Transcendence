echo "This command will remove all existing Docker information locally stored."
echo "Are you sure you want to continue? (y/n)"
read confirmation

if [ "$confirmation" = "y" ]; then
    echo "Continuing with operation..."
    docker system prune --force
	docker ps
else
    echo "Operation cancelled."
fi
