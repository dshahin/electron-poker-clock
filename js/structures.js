const storage = require('electron-json-storage');
var defaultStructures = require('./defaultStructures');
var toastr = require('toastr');

module.exports = {
    getStructures : getStructures,
    setStructures : setStructures,
    setup : setup
}


function setup(){
    return getStructures().then((structures)=>{
        if(!structures.length){
            return setStructures();
        }else{
            return structures;
        }
    })

}

function getStructures(){
  return new Promise((resolve,reject)=>{
      storage.get('structures', (error, data) => {
          if (error) {
              reject(error);
          }else{
              resolve(data);
              return data;
          }
      });
  });
}

function setStructures(structures){
    structures = structures || defaultStructures;
    return new Promise((resolve,reject)=>{
        storage.set('structures',structures,(error)=>{
            if (error) {
                reject(error);
            }else{
                resolve(structures);
            }
        });
    });

}
