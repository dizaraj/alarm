let alarms = [];

// Add Alarm Function
function addAlarm() {
  const dialog = document.createElement("div");
  dialog.innerHTML = `
    <div id="dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc;">
      <h2>Add New Alarm</h2>
      <div>
        <label for="time">Alarm Time:</label>
        <input type="time" id="time" required>
      </div>
      <div>
        <label for="duration">Duration:</label>
        <input type="number" id="duration" min="1" max="5" value="1" required>
      </div>
      <div id="snackbar">Max 5 mins allowed for ringing.</div>
      <button id="saveBtn" onclick="showSnackbar()">Save</button>
      <button id="cancelBtn">Cancel</button>
    </div>
  `;
  document.body.appendChild(dialog);

  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  saveBtn.addEventListener("click", () => {
    const time = document.getElementById("time").value;
    const duration = document.getElementById("duration").value;

    if (duration > 5) {
      showSnackbar(
        "Max 5 mins allowed for ringing. Don't disturb your neighbours"
      );
      return;
    }

    const newAlarm = { id: alarms.length + 1, time, duration };
    alarms.push(newAlarm);

    // Calculate the delay until the alarm time
    const alarmTime = new Date();
    alarmTime.setHours(time.split(":")[0]);
    alarmTime.setMinutes(time.split(":")[1]);
    const now = new Date();
    const delay = alarmTime.getTime() - now.getTime();

    // Start the new alarm after the delay
    setTimeout(() => startAlarm(newAlarm), delay);

    renderAlarms();
    dialog.remove();
  });

  cancelBtn.addEventListener("click", () => {
    dialog.remove();
  });
}

// Edit Alarm Function
function editAlarm(id) {
  const alarm = alarms.find((alarm) => alarm.id === id);

  const dialog = document.createElement("div");
  dialog.innerHTML = `
    <div id="dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc;">
      <h2>Edit Alarm</h2>
      <div>
        <label for="time">Alarm Time:</label>
        <input type="time" id="time" value="${alarm.time}" required>
      </div>
      <div>
        <label for="duration">Duration:</label>
        <input type="number" id="duration" value="${alarm.duration}" min="1" max="5" required>
      </div>
      <div id="snackbar">Max 5 mins allowed for ringing.</div>
      <button id="saveBtn" onclick="showSnackbar()">Save</button>
      <button id="cancelBtn">Cancel</button>
    </div>
  `;
  document.body.appendChild(dialog);

  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  saveBtn.addEventListener("click", () => {
    const newTime = document.getElementById("time").value;
    const newDuration = document.getElementById("duration").value;

    if (newDuration > 5) {
      // alert("Max 5 mins allowed for ringing. Don't disturb your neighbours");
      return;
    }

    // Update the alarm details
    alarms = alarms.map((alarm) =>
      alarm.id === id
        ? { ...alarm, time: newTime, duration: newDuration }
        : alarm
    );

    renderAlarms();
    dialog.remove();
  });

  cancelBtn.addEventListener("click", () => {
    dialog.remove();
  });
}

// Delete Alarm Function
function deleteAlarm(id) {
  const dialog = document.createElement("div");
  dialog.innerHTML = `
    <div id="dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc;">
      <h2>Are you sure you want to delete this alarm?</h2>
      <button id="confirmBtn">Confirm</button>
      <button id="cancelBtn">Cancel</button>
    </div>
  `;
  document.body.appendChild(dialog);

  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  confirmBtn.addEventListener("click", () => {
    // Find the index of the alarm with the given id
    const index = alarms.findIndex((alarm) => alarm.id === id);
    if (index !== -1) {
      // Remove the alarm from the alarms array
      alarms.splice(index, 1);
      renderAlarms();
    }
    dialog.remove();
  });

  cancelBtn.addEventListener("click", () => {
    dialog.remove();
  });
}

// Snooze Alarm Function
function snoozeAlarm(id) {
  // Snooze alarm logic
}

// Stop Alarm Function
function stopAlarm(id) {
  // Stop alarm logic
}

// Start Alarm Function
function startAlarm(alarm) {
  // Convert duration from minutes to milliseconds
  const durationInMilliseconds = alarm.duration * 60 * 1000;

  // Set the remainingTime to the duration initially
  alarm.remainingTime = durationInMilliseconds;

  // Start a setInterval that decreases the remainingTime every second
  const intervalId = setInterval(() => {
    alarm.remainingTime -= 1000;

    // Update the progress bar
    const progressBar = document.getElementById("progress-bar-" + alarm.id);
    if (progressBar) {
      // Check if the progress bar element exists
      const progress = (alarm.remainingTime / durationInMilliseconds) * 100;
      progressBar.style.width = progress + "%";
    }

    // If remainingTime is 0 or less, stop the alarm
    if (alarm.remainingTime <= 0) {
      clearInterval(intervalId);
      console.log("Alarm has finished!");

      // Play a sound for 10 seconds
      let audio = new Audio("sound.wav");
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 10000);
    } else {
      console.log("Remaining time: " + alarm.remainingTime / 1000 + " seconds");
    }
  }, 1000);
}


// Render Buttons Function
function renderAlarms() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  alarms.forEach((alarm) => {
    const alarmDiv = document.createElement("div");
    alarmDiv.innerHTML = `
    <div>
      <span>Alarm Time: ${alarm.time}</span>
      <span>Duration: ${alarm.duration}</span>
      <button onclick="editAlarm(${alarm.id})"><i class="material-icons">edit</i></button>
      <button onclick="deleteAlarm(${alarm.id})"><i class="material-icons">delete</i></button>
      <div id="progress-container" style="width: 100%; background-color: #f5f5f5;">
        <div id="progress-bar-${alarm.id}" style="width: 0%; height: 20px; background-color: #3f51b5;"></div>
      </div>
    </div>
  `;
    app.appendChild(alarmDiv);
    startAlarm(alarm);
  });
}

renderAlarms();

const addButton = document.getElementById("addBtn");
addButton.addEventListener("click", addAlarm);

// Show Snackbar Toast
function showSnackbar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
