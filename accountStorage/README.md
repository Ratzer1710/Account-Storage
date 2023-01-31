# Account-Storage
A service to store information about your accounts locally built with JAVA Spring Boot using JPA, Spring Security and Thymeleaf.

# How to run
- Install MySQL at https://dev.mysql.com/downloads/installer/ during installation make sure to download MySQL Workbench 
- Create your MySQL username and password
- Open MySQL Workbench and acces your local instance

![image](https://user-images.githubusercontent.com/75636359/215791019-2e405e6b-54c5-40c5-8ba8-677a172abf23.png)

- Click right click and create schema

![image](https://user-images.githubusercontent.com/75636359/215792746-f59adc65-f039-4577-9c0c-af813ac71b9b.png)

- Enter your database's name and click apply

![image](https://user-images.githubusercontent.com/75636359/215793063-9c32ef71-d5ba-45c5-9dea-333a54b13fe1.png)

- Then, on the pop up window click apply and finish
- Locate accountStorage-0.0.1-SNAPSHOT.jar in accountStorage/target
- Open accountStorage-0.0.1-SNAPSHOT.jar with winzip or winrar and go to BOOT-INF/classes/application.properties
- Open application.properties with a text editor and put your database name, your username (usually root) and your password and save
- Install java version 1.8 or later at https://www.java.com/download/
- Execute accountStorage-0.0.1-SNAPSHOT.jar with java
- Open localhost:8080/index on your browser
- Create an account, login and start storing your accounts!
