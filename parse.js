const dotenv = require('dotenv').config();
const moment = require('moment');
const fs = require('fs');

const dirRaw = process.env.DATA_DIR_RAW;
const dirParsed = process.env.DATA_DIR_PARSED;
const usernames = process.env.USERNAMES.split(';').filter(el => el);
const dateFormat = 'DD-MM-YYYY';

const accessOrCreate = (dir, callback) => {
    fs.access(dir, err => {
        if (err) fs.mkdir(dir, { recursive: true }, callback);
    });
}

accessOrCreate(`${dirParsed}`, () => {
    console.log(`Parsed ata folder created under '/${dirParsed}'`);
});

fs.readdir(dirRaw, (err, userFolders) => {
    if (err) return console.log(err);

    userFolders.forEach(user => {
        fs.readdir(`${dirRaw}/${user}`, (err, languageFolders) => {
            if (err) return console.log(err);
        
            let dataByLanguage = {};

            languageFolders.forEach(language => {
                const dataFiles = fs.readdirSync(`${dirRaw}/${user}/${language}`);

                let dataUnfiltered = [];
                let dataByDate = {}; 
                
                // Copy everything from the raw data files to an array
                dataFiles.map(file => {
                    let data = fs.readFileSync(`${dirRaw}/${user}/${language}/${file}`, 'utf-8');
                    
                    dataUnfiltered = dataUnfiltered.concat(JSON.parse(data));
                });
                
                // Remove dublicate entries from the data
                let dataFiltered = dataUnfiltered.filter((el, index, self) => 
                    index === self.findIndex((t) => (
                        t.skill_id === el.skill_id && t.datetime === el.datetime
                    ))
                );
                
                // Combine all stats from the same day and save them to an object
                // where the key is the day.
                dataFiltered.forEach(entry => {
                    let date = moment(entry.datetime).format(dateFormat);
                    
                    if (date in dataByDate) {
                        dataByDate[date] = dataByDate[date] + entry.improvement; 
                    } else {
                        dataByDate[date] = entry.improvement;
                    }
                });

                dataByLanguage[language] = dataByDate;
            });

            // Write parsed data to file
            fs.writeFile(`${dirParsed}/${user}.json`, JSON.stringify(dataByLanguage, null, 2), () => {
                if (err) return console.log(err);
                
                console.log(`Created parsed data file: '${dirParsed}/${user}.json'`);
            });
        });
    });
});