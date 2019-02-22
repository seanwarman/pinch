/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    title: {
      description: 'The title of the sample (doesn\'t need to be unique)',
      type: 'string',
      unique: false,
      maxLength: 20, // TODO the error checking on this so it displays in the UI.
      example: 'Big Bassline'
    },
    genre: {
      description: 'The type of sample eg Hihat, Snare, Pad, FX.',
      unique: false,
      type: 'string',
      isIn: [
        'Snares',
        'Kicks',
        'Hihats',
        'Cymbals',
        'Perc',
        'Claps',
        'Bass',
        'Pads',
        'Lead',
        'Keys',
        'Vocals',
        'FX',
        'Chords',
        'Loops'
      ]
    },
    owner: {
      description: 'The User model id of the user who created the sample, or the generic samples pool id',
      type: 'number',
      example: 14564
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a

  }


};
