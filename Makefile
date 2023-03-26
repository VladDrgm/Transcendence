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
	@./scripts/run.sh
endif
