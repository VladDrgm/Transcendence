run:
	@echo Running Transcendence...
	@chmod +x scripts/run_docker.sh
	@chmod +x scripts/run.sh

	@echo PORT=3000 > ./pong_backend/.env
	@echo PORT=3001 > ./pong_frontend/.env

	@read -p "Would you like to run the project with Docker? [y/N] " -n 1 -r && \
	echo && \
	if [ $$REPLY = "y" ]; then \
		./scripts/remove_all_images_containers.sh && \
		./scripts/run_docker.sh; \
	else \
		./scripts/run.sh; \
	fi


# 	@chmod +x scripts/run_docker.sh
# 	@touch ./pong_backend/.env
# 	@echo PORT=3000 > ./pong_backend/.env
# 	@echo PORT=3001 > ./pong_frontend/.env
# 	@./scripts/remove_all_images_containers.sh
# 	@./scripts/run.sh
# endif
