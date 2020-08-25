# Tournament Masterpiece
## A Web app, allowing users to create, manage and participate to their own tournaments.

### A singe person fullstack project developped for training purpose.

### The project is using the following stacks : 
**Angular 9 (frontend)**
**ExpressJS (API)**
**MongoDB (database)**


## How to use :
* clone the project

* run the database : 
    * Using Docker :
        * open a Command terminal in the project root
        * type > docker-compose database
    * Without Docker : 
        * Download  [MongoDB compass](https://www.mongodb.com/download-center/community)
        * Create a database with the name ``Tournament-Masterpiece``
        * https://i.imgur.com/oCuVvJl.png
        * ![alt text](https://imgur.com/rQTSka2.png "Step 1 creating DB")
        * Click on create Collection, and create 2 collections with the name ``tournaments`` and ``users``



* run the API
    * Using Docker :
        * open a Command terminal in the project root
        * type ``` docker-compose database ```
    * Without Docker: 
        * open a Command terminal in the project /back directory
        * Type :
         ```cmd
         npm install 
         npm run dev
         ```
          it will open a server on localhost:3000

* run the frontend
    * open a Command terminal in the project /app directory
    * ```cmd
         npm install
         ng serve 
      ``` 
    * it will open a server on localhost:4200

* Once everything is running, open your navigator in localhost:4200

## Deployment

### Frontend

```sh
cd app
npm run build
gcloud app deploy
```

You will need to authenticate to gcloud. Check https://cloud.google.com/sdk/docs/authorizing