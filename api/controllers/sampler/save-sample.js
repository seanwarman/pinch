module.exports = {

    friendlyName: 'Save Sample',

    description: 'Saves the newly recorded sample to a json file in the /samples folder',

    inputs: {
      base64: {
        description: 'The raw URL of the sample in base64 aka the actual sample',
        type: 'string'
      },
      title: {
        description: 'The title of the sample (doesn\'t need to be unique)',
        type: 'string'
      },
      genre: {
        description: 'The type of sample eg Hihat, Snare, Pad, FX.',
        type: 'string'
      }
      // owner: {
      //   description: 'The id of the user who created the sample, or the generic samples pool id',
      //   type: 'number'
      // }
    },

    exits: {
      success: {
        status: 200
      },
      fail: {
        status: 400
      }
    },

    fn: async function(inputs, exits) {

      var fs = require('fs');

      try {
       var sampleRecord = await Samples.create({

          title: inputs.title,
          genre: inputs.genre,
          owner: this.req.me.id

        }).fetch();

      } catch (err) {
        throw err;
      }

      fs.writeFile('./assets/samples/'+sampleRecord.id+'.txt', inputs.base64, function(err){
        if (err) {
          console.log('Sample saving failed!');
          return exits.fail(err);
        }
        console.log('Sample saved!');

      });



      return exits.success(sampleRecord);
    }
};
