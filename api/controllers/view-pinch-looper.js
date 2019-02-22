var fs = require('fs');
module.exports = {


  friendlyName: 'Deliver contact form message',


  description: 'Deliver a contact form message to the appropriate internal channel(s).',


  exits: {

    success: {
      viewTemplatePath: 'pages/pinch-looper'
    }

  },


  fn: async function(inputs, exits) {

    var samplesToSend = [];

    // TODO: figure out how to send the results of the watcher hook rather than repeating it's code here.

    // Grab the contents of /samples
    fs.readdir('./assets/samples', (err, folder)=>{
      if(folder[0] === '.DS_Store') folder.shift();
      folder.forEach((file) => {

        samplesToSend.push({file: file, isPlaying: false, sampleId: undefined});

      });
      return exits.success({samplesFolder: samplesToSend});
    });
  }
};
