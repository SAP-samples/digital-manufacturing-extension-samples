FROM mcr.microsoft.com/mssql/server:2017-CU24-ubuntu-16.04

# Install node/npm
RUN apt-get -y update  && \
        apt-get install -y curl && \
        curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
        apt-get install -y nodejs && \
        apt-get install -y dos2unix

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY app/package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY app /usr/src/app

# Grant permissions for the import-data script to be executable
RUN chmod +x /usr/src/app/init-db.sh


EXPOSE 1433
EXPOSE 8080

CMD /bin/bash ./entrypoint.sh


