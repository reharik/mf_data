NAME=mfdata/seedproject
VERSION=$$(git rev-parse --short HEAD)
NODE_ENV=qa

clean:
	make install

install:
	@rm -rf ./node_modules
	npm install --silent

docker-build:
	docker build -t $(NAME) .

run:	docker-build
	docker-compose up

.PHONY: clean install docker-build run
