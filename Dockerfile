from alpine:latest
RUN apk update && apk add --update gcc musl-dev linux-headers python3 python3-dev py3-pip nodejs npm && mkdir "/app"

COPY . /app
WORKDIR /app

RUN npm install && \
    pip3 install -r requirements.txt --break-system-packages
