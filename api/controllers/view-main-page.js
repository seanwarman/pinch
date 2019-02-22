module.exports = {


  friendlyName: 'Deliver contact form message',


  description: 'Deliver a contact form message to the appropriate internal channel(s).',


  exits: {

    success: {
      viewTemplatePath: 'pages/main'
    }

  },


  fn: async function(inputs, exits) {

var samplesToSend = [];

  // TODO: figure out how to send the results of the watcher hook rather than repeating it's code here.

  // Grab the contents of /samples
  fs.readdir('./assets/samples', (err, folder)=>{
    if(folder[0] === '.DS_Store') folder.shift();
    folder.forEach((file) => {

      // Read each file in /samples
      fs.readFile('./assets/samples/'+file, 'utf8', (err, contents)=>{
        samplesToSend.push({name: file, base64: contents});

        // Send the names and contents of each folder in /samples
        if(samplesToSend.length === folder.length) return exits.success({samplesFolder: samplesToSend});

      });

    });
  });




  }
};
