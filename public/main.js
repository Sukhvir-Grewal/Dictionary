// This variable is to set the width of the bodyContainer
var lineWidth = 0;

// This function is to play audio
function playAudio(){
    var audio = document.getElementById("audio");
    audio.play().then(() => {
        console.log('Audio playing successfully');
    }).catch(error => {
        console.log('Error playing audio:', error);
    });
}
