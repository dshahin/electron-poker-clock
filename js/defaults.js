const storage = require('electron-json-storage');

module.exports = {
        clearAllData,
        setDefaults,
        getDefaults,
        defaultSettings
};

var defaultSettings = {
    'background' : 'gray'
};

function getDefaults(){
    return new Promise((resolve,reject)=>{
        storage.get('defaults', (error, data) => {
            if (error) {
                reject(error);
            }else{
                resolve(data);
                return data;
            }
        });
    });
}

function setDefaults(defaults){
    defaults = defaults || defaultSettings;
    return new Promise((resolve,reject)=>{
        storage.set('defaults',defaults,(error,data)=>{
            if (error) {
                reject(error);
            }else{
                resolve(data);
            }
        });
    });



}

function clearAllData(){
    return new Promise(function (resolve,reject){
        storage.clear((error,data)=>{
            if(error){
                reject(error);
            }else{
                resolve(data);
            }

        });
    });

}
