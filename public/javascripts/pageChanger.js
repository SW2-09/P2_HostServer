let tasks_computed = null;
let compute = null;

const mainDiv = document.getElementById("mainDiv");

/**
 * An async function that await the database for a boolean value.
 * Function is a ternary operator that checks if compute is true or false and returns the corresponding html code.
 * @returns content: The HTML pages for the home page and account settings page.
 */
async function getContent() {
    await fetchDataDB();
    const content = {
        VideoStream: `
    <header>
      <div class="header_logo">
        <label class="logo"> GridFlix </label>
      </div>
      <div class="headerItems">
        <button id="settingsButton" > Settings </button>
        <button id="logoutButton" > Logout </button>
        <button id="nameButton"> ${name} </button>
      </div>
    </header>
      <div class="left">
        <div class="video" style="--aspect-ratio: 2/3">
          <iframe
            src="https://www.youtube.com/embed/aqz-KE-bpKQ"
            title="YouTube video player"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
  `,

        AccountSettings: `
    <div class="frontpage">
    <header>
      <div class="header_logo">
        <label class="logo"> GridFlix</label>
      </div>
      <div class="headerItems">
        <button id="homeButton" > Home </button>
        <button id="logoutButton" > Logout </button>
        <button id="nameButton"> ${name} </button>
      </div>
    </header>
      <div class="userinfo">
         <h2>Account Settings</h2>
      </div>
      <div class="right">
        <div class="compute">
          <div class="header">
            <h3>Subscription details</h3>
          </div>
          ${
              compute
                  ? `
              <div class="computeYes" id="computeYes">
                You are currently computing while watching GridFlix
                <input
                  type="button"
                  name="changeComputeButton"
                  id="changeComputeButton"
                  class="changeComputeButton"
                  value="Change subscription details"
                />
              </div>
            `
                  : `
              <div class="computeNo" id="computeNo">
                You are currently not computing while watching GridFlix
                <input
                  type="button"
                  name="changeCompute"
                  id="changeComputeButton"
                  value="Change subscription details"
                />
              </div>
            `
          }
        </div>
        <br />
        <div class="subtasks">
          <div class="header">
            <h3>Contribute History</h3>
          </div>
          Number of subtasks completed: <span id ="subtasksValue"> ${tasks_computed} </span>
          <input
          type="button"
          name="updateTasksValueButton"
          id="updateTasksValueButton"
          class="updateTasksValueButton"
          value="Update contribution history"
        />
        </div>
        <br />
        <div class="points">
          <div class="header">
            <h3>Points</h3>
          </div>
          Points obtained: <span id ="pointsValue"> ${tasks_computed} </span> 
          <input
          type="button"
          name="pointsValueButton"
          id="pointsValueButton"
          class="pointsValueButton"
          value="Update points obtained"
        />
        </div>
      </div>
    </div>
  `,
    };

    return content;
}

/**
 * An async function that await the database for a boolean value.
 * Starts computing if the boolean value is true on reload page.
 */
async function handleChange() {
    const respons = await getDataFromDB();
    compute = respons.compute;
    if (compute === true) {
        if (typeof w === "undefined") {
            w = new Worker("/javascripts/Webworker.js");
            console.log("Worker is computing");
        }
    } else if (compute === false) {
        console.log("Worker is not computing");
    }
}

/** */

function updateTextTasksComputed(subtasksValue, tasks_computed) {
    const element = document.getElementById("subtasksValue");
    if (subtasksValue) {
        element.textContent = tasks_computed;
    }
}

function updateTextPoints(pointsValue, tasks_computed) {
    const element = document.getElementById("pointsValue");
    if (pointsValue) {
        element.textContent = tasks_computed;
    }
}

/**
 * an async event listener that updates the computed tasks shown on screen
 */
mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "updateTasksValueButton") {
        try {
            console.log("updating tasks value");
            let respons = await fetch("/worker/updateDB");
            if (!respons.ok) {
                throw new Error("Error updating tasks value");
            }
            const responsJson = await respons.json();
            tasks_computed = responsJson.tasks_computed;
            console.log("You have now computed " + tasks_computed);
            updateTextTasksComputed("subtasksValue", tasks_computed);
        } catch (err) {
            console.log(err);
        }
    }
});

/**
 * logout button
 */
mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "logoutButton") {
        try {
            if (typeof w !== "undefined") {
                w.terminate();
                console.log("Worker is terminated");
            }
        } catch (err) {
            console.log(err);
        }

        try {
            const respons = await fetch("/worker/logout");
            if (!respons.ok) {
                throw new Error("Error logging out");
            }
            location.reload();
        } catch (err) {
            console.log(err);
        }
    }
});

/**
 * An event listener that that updates the points obtained shown on screen
 */
mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "pointsValueButton") {
        try {
            console.log("updating points obtained");
            let respons = await fetch("/worker/updateDB");
            if (!respons.ok) {
                throw new Error("Error updating points obtained");
            }
            const responsJson = await respons.json();
            tasks_computed = responsJson.tasks_computed;
            console.log("You have now obtained " + tasks_computed);
            updateTextPoints("pointsValue", tasks_computed);
        } catch (err) {
            console.log(err);
        }
    }
});

/**
 * MAYBE ADD ASYNC TO THIS FUNCTION
 * An event listener that run enchangePageToHome() when a button is clicked.
 */
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "homeButton") {
        changePageToHome();
    }
});

/**
 * MAYBE ADD ASYNC TO THIS FUNCTION
 * An event listener that run enchangePageToSettings() when a button is clicked.
 */
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "settingsButton") {
        changePageToSettings();
    }
});

/**
 * An async function that await the database for a boolean value.
 * Function then checks if the boolean value is true or false and change the value to the opposite.
 * Function then sends the new value to the database.
 */
mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "changeComputeButton") {
        if (
            confirm(
                "Are you sure you want to change your subscription details?"
            ) === false
        )
            return;
        try {
            console.log("changing compute value");
            await fetchDataDB();
            const respons = await fetch("/worker/updateComputeDB", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ compute: compute }),
            });

            if (respons.status === 200) {
                const responsJson = await respons.json();
                console.log(responsJson.message);
                location.reload();
            } else {
                console.log("Error");
            }
        } catch (err) {
            console.log(err);
        }
    }
});

/**
 * An async function that await the database and extract the data from the database.
 * @returns data, the data from the database.
 */

async function getDataFromDB() {
    let respons = await fetch("/worker/updateDB");
    if (!respons.ok) {
        throw new Error("HTTP error " + respons.status);
    }
    const data = await respons.json();
    console.log(data);
    return data;
}

/**
 * An async function that await the function fetchDataDB() if both boolean is null.
 * @returns tasks_computed, the number of subtasks completed.    OG MULIGVVIS NAVN
 */
async function fetchDataDB() {
    if (tasks_computed === null || compute === null) {
        const respons = await getDataFromDB();
        tasks_computed = respons.tasks_computed;
        compute = respons.compute;
        name = respons.name;
    }
    return { tasks_computed, compute, name };
}

/**
 * An async fiunction that changes the page to the ettings site.
 */
async function changePageToSettings() {
    const content = await getContent();
    if ((mainDiv.innerHTML = content.VideoStream)) {
        console.log("changing page to settings");
        mainDiv.innerHTML = content.AccountSettings;
    }
}

/**
 * An async function that changes the page to the home site.
 */
async function changePageToHome() {
    const content = await getContent();
    if ((mainDiv.innerHTML = content.AccountSettings)) {
        console.log("changing page to home");
        mainDiv.innerHTML = content.VideoStream;
    }
}

async function showFrontPage() {
    const content = await getContent();
    mainDiv.innerHTML = content.AccountSettings;
}

showFrontPage();
