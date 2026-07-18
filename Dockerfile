FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew :app:bootJar -x test

EXPOSE 8080

CMD ["java","-jar","app/build/libs/app-0.0.1-SNAPSHOT.jar"]