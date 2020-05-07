const dotenv = require('dotenv').config()
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

const dirRaw = process.env.DATA_DIR_RAW;
const date = moment().toISOString(true);
const url = 'https://www.duolingo.com/users';
const usernames = process.env.USERNAMES.split(';').filter(el => el);

const accessOrCreate = (dir, callback) => {
    fs.access(dir, err => {
        if (err) fs.mkdir(dir, { recursive: true });
        callback();
    });
}

usernames.map(user => {
    axios.get(`${url}/${user}`, {
        headers: { Cookie: process.env.API_TOKEN },
        withCredentials: true
    })
        .then(res => res.data)
        .then(res => {
            if ('language_data' in res) {
                // loop through all language keys and save the data to file
                Object.keys(res.language_data).forEach(lang => {
                    const data = res.language_data[lang].calendar;

                    if (data) {
                        const languageDir = `${dirRaw}/${user}/${lang}`;

                        // create language folder if they don't exist
                        accessOrCreate(languageDir, () => { 
                            // write data to file
                            fs.writeFile(`${languageDir}/${date}-${user}-${lang}.json`, JSON.stringify(data), (err) => {
                                if (err) return console.log(err);
            
                                console.log(`Saved API Data to file: '${languageDir}/${date}-${user}-${lang}.json'`);
                            });
                        });
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
});