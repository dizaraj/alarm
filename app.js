var addBtn = document.getElementById("addBtn");
var bar = document.getElementById("js-progressbar");
var audio = new Audio("/sounds/beep_01.wav");
var endAudio = new Audio("/sounds/sound_01.wav");
audio.loop = true;
var time = document.getElementById("time");
var animate;

function timer() {
  // Disable the button
  addBtn.disabled = true;

  animate = setInterval(function () {
    // console.log(bar.value);
    if (bar.value <= 0) {
      clearInterval(animate);
      audio.pause();
      audio.currentTime = 0;
      endAudio.play();
      endAudio.loop = true;
      // set alarm audio for 8 seconds
      setTimeout(function () {
        endAudio.pause();
        endAudio.currentTime = 0;
        // Enable the button
        addBtn.disabled = false;
      }, 8000);
    } else {
      bar.value -= 1;
      time.innerHTML =
        bar.value.toString().padStart(2, "0") +
        `<span class="uk-badge" style="background: red;">seconds</span>`;
      if (audio.paused) {
        audio.play();
      }
    }
    // console.log(bar.value);
  }, 1000);
}

addBtn.addEventListener("click", function () {
  if (animate) {
    clearInterval(animate);
    audio.pause();
    audio.currentTime = 0;
    bar.value = 60;
  }
  timer();
});
