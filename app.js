var addBtn = document.getElementById("addBtn");
var bar = document.getElementById("js-progressbar");
var audio = new Audio("/sounds/beep_01.mp3");
var endAudio = new Audio("/sounds/sound_01.mp3");
audio.loop = true;
var time = document.getElementById("time");
var animate;

function disableButton() {
  addBtn.disabled = true;
}

function enableButton() {
  addBtn.disabled = false;
}

function updateProgressBar() {
  bar.value -= 1;
  time.innerHTML =
    bar.value.toString().padStart(2, "0") +
    `<span class="uk-badge" style="background: red;">seconds</span>`;
}

function playAudio(audioElement) {
  if (audioElement.paused) {
    audioElement.play();
  }
}

function stopAudio(audioElement) {
  audioElement.pause();
  audioElement.currentTime = 0;
}

function timer() {
  disableButton();

  animate = setInterval(function () {
    if (bar.value <= 0) {
      clearInterval(animate);
      stopAudio(audio);
      endAudio.play();
      endAudio.loop = true;

      setTimeout(function () {
        stopAudio(endAudio);
        enableButton();
      }, 8000);
    } else {
      updateProgressBar();
      playAudio(audio);
    }
  }, 1000);
}

addBtn.addEventListener("click", function () {
  if (animate) {
    clearInterval(animate);
    stopAudio(audio);
    bar.value = 60;
  }
  timer();
});
