
parasails.registerPage('pinch-looper', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    samplesFolder: [],
    // Note. Don't render the whole of this keyboard object to the page it causes Vue to log a 'circular structure' error to the console.
    keyboard: {
      // Loops
      'q': { playId: 1, isPlaying: false, sample: 'Beat(Yu).mp3', oneShot: false },
      'w': { playId: 2, isPlaying: false, sample: 'Beat.mp3', oneShot: false },
      'e': { playId: 5, isPlaying: false, sample: 'MeloSynth.mp3', oneShot: false },
      'r': { playId: 7, isPlaying: false, sample: 'Stab1.mp3', oneShot: false },
      't': { playId: undefined, isPlaying: false, sample: '', oneShot: false },
      'y': { playId: undefined, isPlaying: false, sample: '', oneShot: false },
      'u': { playId: undefined, isPlaying: false, sample: '', oneShot: false },
      'i': { playId: undefined, isPlaying: false, sample: '', oneShot: false },
      'o': { playId: undefined, isPlaying: false, sample: '', oneShot: false },
      'p': { playId: undefined, isPlaying: false, sample: '', oneShot: false },
       // One-shots
      'a': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      's': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'd': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'f': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'g': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'h': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'j': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'k': { playId: undefined, isPlaying: false, sample: '', oneShot: true },
      'l': { playId: undefined, isPlaying: false, sample: '', oneShot: true }
    },
    shiftCombo: ''
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
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
      if(!listener.repeat && listener.key !== 'Shift') {
        this.keyDown(listener);
      }
    });
    document.addEventListener('keyup', (listener) => {
      if(listener.key !== 'Shift') {
        this.keyUp(listener);
      }
    });

    // This initialises the AudioContext, which also initialises the analyser.
    // In future this should also help us to set up the mixer as well,
    // once the AudioContext is set up everything else can be set up inside it.
    this.samplePlayer('a', this.keyboard['a'].isPlaying);
    this.samplePlayer('a', this.keyboard['a'].isPlaying);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    updateAnalyser: function(audioContext, elementId) {
      // Create a new object in the Howler global object for the analyser
      Howler.analyser = Howler.ctx.createAnalyser();
      Howler.masterGain.connect(Howler.analyser);

      var freqData = new Uint8Array(Howler.analyser.frequencyBinCount);

      let canvas = document.getElementById('master-analyser');
      let wrapper = document.getElementById('analyser-wrapper');

      canvasCtx = canvas.getContext('2d');

      // Not sure this is needed but put it back if it is...
      // let width = 300;
      // let height = 150;
      // canvasCtx.clearRect(0, 0, width, height);

      function draw() {
        // Grab the canvas' parent to assign the correct width and height (this doesn't work properly using css).
        // Keep it in this loop so it changes when the window width does.
        canvas.width = wrapper.offsetWidth-2;
        canvas.height = wrapper.offsetHeight-2;


        // Start drawing onto the canvas
        var drawVisual = requestAnimationFrame(draw);

        Howler.analyser.getByteTimeDomainData(freqData);

        canvasCtx.fillStyle = '#e6e6e6';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 4;
        canvasCtx.strokeStyle = '#ff6041';
        canvasCtx.beginPath();

        var sliceWidth = canvas.width * 1.0 / Howler.analyser.frequencyBinCount;
        var x = 0;

        for(var i = 0; i < Howler.analyser.frequencyBinCount; i++) {

          var v = freqData[i] / 128.0;
          var y = v * canvas.height/2;

          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
          canvasCtx.stroke();
      };

      draw();

    },

    samplePlayer: function(key, isPlaying) {

      if(isPlaying) {
        this.keyboard[key].playId.stop();
        this.keyboard[key].isPlaying = false;


      } else if(!isPlaying) {
        this.keyboard[key].playId = new Howl({
          src: ['../../samples/'+this.keyboard[key].sample],
          loop: true
        });
        this.keyboard[key].playId.play();
        this.keyboard[key].isPlaying = true;

        this.updateAnalyser();

      }
    },

    sampleShot: function(key) {
      this.keyboard[key].playId = new Howl({
        src: ['../../samples/'+this.keyboard[key].sample]
      });
      this.keyboard[key].playId.play();

      // This is for the lights to flash with the sample.
      this.keyboard[key].isPlaying = true;
      setTimeout( () => { this.keyboard[key].isPlaying = false; }, 50);
    },

    previewSamplePlayer: function(index) {

      if(!this.samplesFolder[index].isPlaying) {
        this.samplesFolder[index].sampleId = new Howl({
          src: ['../../samples/'+this.samplesFolder[index].file]
        });
        this.samplesFolder[index].sampleId.play();
        this.samplesFolder[index].isPlaying = true;

        this.updateAnalyser();

        // If the sample runs to the end on it's own change it's isPlaying status...
        this.samplesFolder[index].sampleId.on('end', () => {
          this.samplesFolder[index].isPlaying = false;
        });

      } else if(this.samplesFolder[index].isPlaying) {
        this.samplesFolder[index].sampleId.stop();
        this.samplesFolder[index].isPlaying = false;
      }
    },

    keyDown: function(listener) {
      // If the user is holding the shift key.
      if(listener.shiftKey) {
        this.shiftCombo = listener.key.toLowerCase();

        // If the key is set to one-shot
      } else if(this.checkSampleKey(listener.key, this.keyboard) && this.keyboard[listener.key].oneShot) {
        this.sampleShot(listener.key);

        // if the user is pressing any of the keyboard.samples. And it's not already playing, play it...
      } else if(this.checkSampleKey(listener.key, this.keyboard) && !this.keyboard[listener.key].isPlaying) {
        this.samplePlayer(listener.key, this.keyboard[listener.key].isPlaying);

        // If it is playing already, stop it...
      } else if(this.checkSampleKey(listener.key, this.keyboard) && this.keyboard[listener.key].isPlaying) {
        this.samplePlayer(listener.key, this.keyboard[listener.key].isPlaying);
      }
    },

    keyUp: function(listener) {
      // We only want to store the keyCombo while it's being held down.
      if(this.shiftCombo === listener.key.toLowerCase()) {
        this.shiftCombo = '';
      }
    },

    assignSample: function(key, sampleFileName) {
      if(key) {
        // If this sample is already assigned to this key, unassign them.
        if(sampleFileName === this.keyboard[key].sample) {
          this.keyboard[key].sample = '';
        } else {
          this.keyboard[key].sample = sampleFileName;
        }
      }
    },

    returnKeys: function(obj, start, end) {
      return Object.keys(obj).slice(start, end);
    },

    checkSampleKey: function(letter, object) {
      // Check to see if the given letter is in this.keyboard...(or any other keyboard object we make in future)
      return Object.keys(object).find((key) => {
        return letter === key;
      })
    }

  }

});
