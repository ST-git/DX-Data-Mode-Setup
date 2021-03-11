const csv = require('csv-parser');
const fs = require('fs');
const results = [];

let objects = new Set();
fs.createReadStream('./csv-data/objects.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    let objects = [];
    for (let row of results) {
      let sobject = new SObject(row);
      objects.push(sobject);
    }
    createObjectData(objects);
  });


function createObjectData(objects) {
  for (let object of objects) {
    //sfdx shane:object:create --label "Game1" --plural "Game1s" --api Game1__c -t custom ---nametype=Text --description="this stores customer's game record1"
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);

    createObjectDataByDX();
    async function createObjectDataByDX() {
      let command = `sfdx shane:object:create --label "${object.label}" --plural "${object.plural}" --api ${object.api} -t custom --nametype=${object.nameType} --description="${object.description}" ${object.namefieldlabel} ${object.autonumberformat} ${object.activities} ${object.feeds} ${object.reports} ${object.search} ${object.history} --enterprise`;
      console.log(command);

      const {
        stdout,
        stderr
      } = await exec(command);

      if (stdout) {
        console.log('Stdout: => ', stdout);
      }
      if (stderr) {
        console.log('ERROR: => ', stderr);
      }
    }
  }
}


function SObject(obj) {
  this.label = obj.label;
  this.plural = obj.plural;
  this.api = obj.api;
  this.description = obj.description;
  this.nameType = obj.nameType == 'Text' ? 'Text' : 'AutoNumber';
  this.namefieldlabel = obj.namefieldlabel ? `--namefieldlabel="${obj.namefieldlabel}"` : '';
  this.autonumberformat = obj.nameType.includes('AutoNumber') == true ? `--autonumberformat=${obj.nameType.split('_')[1]}` : '';
  this.activities = obj.activities == 'y' ? '--activities' : '';
  this.feeds = obj.feeds == 'y' ? '--feeds' : '';
  this.reports = obj.reports == 'y' ? '--reports' : '';
  this.search = obj.search == 'y' ? '--search' : '';
  this.history = obj.history == 'y' ? '--history' : '';
}
