# Soundboard

This is a very simple drag and drop soundboard app. It allows you to drag a number of MP3 files into different sound "blocks". Clicking a block will then play the corresponding sound file.

![The soundboard app](screenshots/soundboard.png "The soundboard app")

The app [lives here](https://timendus.github.io/soundboard/), and can be installed as a progressive web app through your web browser.

The app will generate a number of blocks that comfortably fit on your screen. If you resize the window this may mess things up, but the app will not automatically add blocks or throw blocks away as you probably don't want that. So resize, then refresh, then start adding files.

## Settings

You can switch the app to settings mode by clicking the wrench in the top right corner. In that mode you can manually add a row or a column if you run out of space. And in settings mode you can change the playback mode and the colour of your sound blocks.

![Settings mode](screenshots/settings.png "Settings mode")

### Playback modes

Soundboard has three:

* Retrigger (default, denoted by `-`) — Clicking the block repeatedly will play the song from the beginning repeatedly. Mostly useful for sound effects and drums.
* OneShot (denoted by `|`) — Clicking the block plays it, clicking again stops playback. Mostly useful for things like background music.
* Gate (denoted by `o`) — Clicking the block and holding down your finger or mouse button plays the sound. Releasing stops playback. Useful for short-lived variable duration effects like applause.

## Developing

This should get you up and running locally:

```bash
$ git clone git@github.com:Timendus/soundboard.git
$ cd soundboard
$ npm install
$ npm run start
```

PRs with improvements are welcome, as always. Feedback too. mail@timendus.com
