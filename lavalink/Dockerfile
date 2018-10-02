FROM openjdk:12-alpine

WORKDIR /etc/lavalink
COPY . .

RUN apk update && \
	apk add ca-certificates wget && \
	wget -q https://ci.fredboat.com/repository/download/Lavalink_Build/5180:id/Lavalink.jar?guest=1 -O Lavalink.jar

CMD ["java", "-Xmx4g", "-jar", "Lavalink.jar"]
