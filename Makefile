SHELL := /bin/bash

run:
	@echo Running Transcendence...
	@chmod +x scripts/run_docker.sh
	@chmod +x scripts/run.sh

	# backend .env
	@if [ -z "$$(grep -o '^PORT=[^[:blank:]]*' ./pong_backend/.env)" ] || \
		[ -z "$$(grep -o '^DB_USERNAME=[^[:blank:]]*' ./pong_backend/.env)" ] || \
		[ -z "$$(grep -o '^DB_PASSWORD=[^[:blank:]]*' ./pong_backend/.env)" ] || \
		[ -z "$$(grep -o '^DB_PORT=[^[:blank:]]*' ./pong_backend/.env)" ] || \
		[ -z "$$(grep -o '^DB_HOSTNAME=[^[:blank:]]*' ./pong_backend/.env)" ]; then \
		echo "Backend .env file is missing required values. Please insert all values as required."; \
		read -p "Enter the PORT for the backend: " PORT && \
		echo "PORT=$$PORT" > ./pong_backend/.env; \
		read -p "Enter the DB_USERNAME for the backend: " DB_USERNAME && \
		echo "DB_USERNAME=$$DB_USERNAME" >> ./pong_backend/.env; \
		read -p "Enter the DB_PASSWORD for the backend: " DB_PASSWORD && \
		echo "DB_PASSWORD=$$DB_PASSWORD" >> ./pong_backend/.env; \
		read -p "Enter the DB_PORT for the backend: " DB_PORT && \
		echo "DB_PORT=$$DB_PORT" >> ./pong_backend/.env; \
		read -p "Enter the DB_HOSTNAME for the backend: " DB_HOSTNAME && \
		echo "DB_HOSTNAME=$$DB_HOSTNAME" >> ./pong_backend/.env; \
	fi

	# frontend .env
	@if [ -z "$$(grep -o '^PORT=[^[:blank:]]*' ./pong_frontend/.env)" ]; then \
		echo "Frontend .env file is missing required values. Please insert all values as required."; \
		read -p "Enter the PORT for the frontend: " PORT && \
		echo "PORT=$$PORT" > ./pong_frontend/.env; \
	fi

	@read -p "Would you like to run the project with Docker? [y/N] " -n 1 -r && \
	echo && \
	if [ "$$REPLY" = "y" ]; then \
		./scripts/remove_all_images_containers.sh && \
		./scripts/run_docker.sh; \
	else \
		./scripts/run.sh; \
	fi
