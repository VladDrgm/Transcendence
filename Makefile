run:
	@echo Running Transcendence...
	@echo OS: $(OS)

ifeq ($(OS),Windows_NT)
	@echo Running Windows script...
	@call scripts\run.bat
else
	@echo Running Unix script...
	@chmod +x scripts/run.sh
	@touch ./pong_backend/.env
	@echo PORT=3000 > ./pong_backend/.env
	@echo PORT=3001 > ./pong_frontend/.env
	@./scripts/remove_all_images_containers.sh
	@./scripts/run.sh
endif
