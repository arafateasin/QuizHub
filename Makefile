.PHONY: help install dev build test clean docker-build docker-up docker-down

help:
	@echo "QuizHub - Available Commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Run all services in development mode"
	@echo "  make build        - Build all services"
	@echo "  make test         - Run all tests"
	@echo "  make clean        - Clean node_modules and build artifacts"
	@echo "  make docker-build - Build Docker images"
	@echo "  make docker-up    - Start all Docker containers"
	@echo "  make docker-down  - Stop all Docker containers"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

clean:
	npm run clean

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f
