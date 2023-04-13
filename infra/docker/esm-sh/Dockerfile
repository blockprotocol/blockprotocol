FROM --platform=linux/x86-64 golang:1.18

RUN apt-get update -y && apt-get install -y xz-utils
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - &&\
    apt-get install -y nodejs
RUN curl -fsSL https://get.pnpm.io/install.sh | bash -

RUN useradd -u 1000 -m esm
RUN mkdir /esm && chown esm:esm /esm

# Ideally this would be configuring the npm install directory, not modifying /usr permissions
# But modifying the install directory caused the esm.sh process to hang
# Requires more investigation that wasn't worth it at the time of writing
RUN chown esm:esm /usr/lib/node_modules
RUN chown esm:esm /usr/bin

RUN git clone https://github.com/esm-dev/esm.sh /esm

WORKDIR /esm

# Set the version of esm.sh to use
RUN git checkout v115

USER esm

COPY config.json config.json
RUN go build -o bin/esmd main.go

CMD ["/esm/bin/esmd", "--config", "config.json"]
