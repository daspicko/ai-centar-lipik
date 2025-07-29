FROM node:lts-bookworm
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl python3 python3-venv python3-pip pandoc texlive-xetex texlive-fonts-recommended texlive-plain-generic

ENV PATH="/opt/.venv/bin:$PATH"

COPY . /app/
WORKDIR /app

RUN python3 -m venv /opt/.venv && \
    pip3 install --upgrade pip && \
    pip3 install -r requirements.txt && \
    npm install
