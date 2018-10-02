FROM openjdk:10-jre-slim

WORKDIR /etc/lavalink
COPY . .

RUN apt-get update && \
	apt-get install -y wget && \
	wget -q https://ci.fredboat.com/repository/download/Lavalink_Build/5180:id/Lavalink.jar?guest=1 -O Lavalink.jar

CMD ["java", "-Xmx4g", "-jar", "Lavalink.jar"]
