FROM python:3.7-alpine
MAINTAINER Nicolas Inden <nicolas@inden.one>

WORKDIR /usr/src/app

RUN apk add zlib-dev jpeg-dev build-base

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

VOLUME ["/usr/src/app/data"]

EXPOSE 8080

ENTRYPOINT [ "python", "./src/run.py" ]
