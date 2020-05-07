# Duolingo Activity Scrapper

Small tool that scraps and saves all relevant data from the Duolingo API, to track and create a history
of your duolingo activies. That is neccessary because the duolingo website and app only show your daily activies
for the current week. 

The scrapper is meant to be run weekly or even daily (the saved data is rather small, depending on your activity)
with a crontab because the api only returns data for the last 8 days. Sadly the API only returns the data 
for the language that you last completed a lesson for, which makes it hard to track your activies if you are 
learning multiple languages.

## Setup

Please make sure to copy the `.env.example` file as `.env` and fill out every given parameter, otherwise the application
won't run. Further explanation is given in the `.env.example`.

## Run this application

### To scrap the API, save the data to files and create parsed json files simply run the following commands:
```
npm i && npm run build 
```

### To only scrap the API, simply run:
```
node scrap
```

### To only parse the data, simply run:
```
node parse
```