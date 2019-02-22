/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

parasails.registerPage('main', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    samplesFolder: [],
    sampleId: {},
    assignedSamples: {},
    sampleStart: 0,
    sampleEnd: 4000


  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

  },

  mounted: async function() {

    // This joins the current page to the socket room 'goodRoom'.
    io.socket.get('/socket', function(response) {
      console.log(response);
    });

    // This socket watches the contents of the samples folder.
    io.socket.on('goodRoom', (folderContents) => {
      this.samplesFolder = folderContents;
    });

    // Keyboard listeners
    document.addEventListener('keydown', (listener) => {
      if(!listener.repeat) {
        console.log(listener);
        this.playSample(this.samplesFolder[0].name, 'play', listener.key);
      }
    });

    document.addEventListener('keyup', (listener) => {
      this.playSample(this.samplesFolder[0].name, 'stop', listener.key);
    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {


    playSample: function(sample, transportMessage, key) {

      if(transportMessage === 'stop') {

        this.sampleId[key].stop();

      } else if(transportMessage === 'play') {

        this.sampleId[key] = new Howl({
          src: ['../../samples/'+sample],
          loop: true,
          sprite: {
            one: [this.sampleStart, this.sampleEnd, true]
          },
          rate: 1
        });

        this.sampleId[key].play('one');
      }
    }

  }

});
