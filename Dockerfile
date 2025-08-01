FROM daspicko/jupyter-notebook-converter:latest

ENV PATH="/opt/.venv/bin:$PATH"

COPY . /app/
WORKDIR /app

RUN pip3 install -r requirements.txt && \
    npm install
