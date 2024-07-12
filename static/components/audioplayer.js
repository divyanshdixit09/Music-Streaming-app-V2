export default { 
    template :`
    <div style="background-color: #f0f0f0; padding: 5px; border-radius: 5px;">
    <p style="color: #333; font-size: 18px; margin-bottom: 5px;">Now Playing:</p>
    <audio ref="audioPlayer" :src="currentSong.url" controls style="background-color: #fff; border-radius: 5px;"></audio>
</div>`

    ,
  data() {
    return {
      currentSong: {
        url: '/static/uploads/Chipi Chipi Chapa Chapa Ringtone Download.mp3' // Replace this with the path to your song in the static folder
      }
    };
  }
};
