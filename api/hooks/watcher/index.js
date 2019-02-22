module.exports = function sampleFolder(sails) {

  return {

    sampleFolder: function() {

      var fs = require('fs');

      sendFiles = async function() {

        console.log('there was a change');
        var samplesToSend = [];

        // Grab the contents of /samples
        fs.readdir('./assets/samples', (err, folder)=>{
          if(folder[0] === '.DS_Store') folder.shift();

            folder.forEach( (file, index) => {
              folder[index] = {file: file, isPlaying: false, sampleId: undefined };
            })

            sails.sockets.broadcast('goodRoom', 'goodRoom', folder);

        });
      }

      // Call send files so we can send the initial state of /samples whenever we want with sails.hooks.watcher.sampleFolder();
      sendFiles();

      // Listen to the samples folder for any changes
      fs.watch('./assets/samples', 'utf8', function(event, file) {

       if (file !== '.DS_Store') {
          sendFiles();
        }
      });
    },

    initialize: function(callback) {
      callback(this.sampleFolder());
    }

  };

};
