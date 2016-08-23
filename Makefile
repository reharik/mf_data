NAME=mf_data/seedproject
VERSION=$$(git rev-parse --short HEAD)
NODE_ENV=qa

clean:
	make install

install:
	rm -rf ./node_modules
	npm install --silent

docker-build:
	docker build -t $(NAME) -f docker/Dockerfile .

run:	docker-build
	docker-compose -f docker/docker-compose.yml run --service-ports --rm seed

.PHONY: clean install docker-build run
