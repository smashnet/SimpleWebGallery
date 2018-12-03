FROM python:3.7-alpine
MAINTAINER Nicolas Inden <nicolas@inden.one>

WORKDIR /usr/src/app

RUN apk add zlib-dev jpeg-dev build-base nodejs npm

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

RUN npm install
RUN npm run compile

EXPOSE 8080

ENTRYPOINT [ "python", "./src/py/run.py" ]
