run:
ifeq ($(OS),Windows_NT)
	@echo Running Windows script...
	@call scripts\run.bat
else
	@echo Running Unix script...
	@./scripts/run.sh
endif
