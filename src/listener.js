/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }
  async listen(message) {
    try {
      const {playlistId, userId, targetEmail} = JSON.parse(message.content.toString());
      const playlists = await this._playlistsService.getPlaylists(userId);
      const songs = await this._playlistsService.getSongsByPlaylistId(playlistId);
      playlists.songs = songs;
      const attachment = {
        playlist: playlists,
      };
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(attachment));
      console.log(attachment);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = Listener;
