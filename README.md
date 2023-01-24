# How to use the application

## Initialise the database
- Install [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) on your machine.
- In the terminal, run the command `docker-compose up -d` or `docker compose up -d` in the `dropbeartable` directory.
- install mongoDB Compass and use the connection string mongodb://admin:password@localhost:27017/
- from the home screen click on 'create database' enter the database name 'test' and collection name 'restaurants'
- from the home screen click on the newly created 'test' database, then click on the collection 'restaurants'
- from the restaurants collection page click on 'ADD DATA' a drop down menu will appear click on 'import file'
- click 'browse' from the pop up menu and select the 'restaurants.json' file found in the server folder and click 'DONE'
- the restaurants database is now populated.

## Run the application
- Open your browser and visit the URL localhost:8080 and you're all set!