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
        <button id="nameButton"> ${name} </button>
        <a href="/worker/logout" class="">Logout</a>
      </div>
    </header>
    ${compute 
        ? `
        <div class="computeYes" id="computeYes">
          <input type="checkbox" name="option" value="yes" checked>
        </div>
      `
        : `
        <div class="computeNo" id="computeNo">
          <input type="checkbox" name="option" value="no" checked>
        </div>
      `
    }
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
        <button id="nameButton"> ${name} </button>
        <a href="/worker/logout" class="">Logout</a>
      </div>
    </header>

      <div class="right">
        <div class="userinfo">
          <h2>Account Settings</h2>
        </div>
        <div class="compute">
          <div class="header">
            <h3>Subscription details</h3>
          </div>
          ${
            compute
              ? `
              <div class="computeYes" id="computeYes">
                You are currently computing while watching GridFlix
                <input type="checkbox" name="option" value="yes" checked>
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
                <input type="checkbox" name="option" value="no" checked>
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
          Number of subtasks completed: ${tasks_computed}
        </div>
        <br />
        <div class="points">
          <div class="header">
            <h3>Points</h3>
          </div>
          Points obtained: <span id="pointsObtained">0</span>
        </div>
      </div>
    </div>
  `,
  };
  
  return content;
}


/**
 * MAYBE ADD ASYNC TO THIS FUNCTION
 * An event listener that run enchangePageToHome() if homeButton is clicked the enchangePageToHome function is called.$
 */
mainDiv.addEventListener("click", (e) => {
  if(e.target.id === "homeButton") {
    changePageToHome();
  }})

  /**
 * MAYBE ADD ASYNC TO THIS FUNCTION
 * An event listener that run enchangePageToSettings() if settingsButtonn is clicked the changePageToSettings function is called.$
 */
mainDiv.addEventListener("click", (e) => {
    if(e.target.id === "settingsButton") {
      changePageToSettings();
    }})


mainDiv.addEventListener("click", async (e) => {
  if (e.target.id === "changeComputeButton") {
    if(confirm("Are you sure you want to change your subscription details?") === false) return;
    try{
      console.log("changing compute value");
      const respons = await fetch("/worker/updateComputeDB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ compute: compute }), 
    });
    
    if(respons.status === 200)
    {  
        const responsJson = await respons.json();
        console.log(responsJson.message);
        location.reload()

    }
    else
    {
        console.log("Error");
    }
    }
    catch(err){
      console.log(err);
    } 
  }})


async function getDataFromDB() {
  let DBdata;
  let respons = await fetch("/worker/updateDB");
  if (!respons.ok) {
    throw new Error("HTTP error " + respons.status);
  }
  const data = await respons.json();
  console.log(data);
  return data;
}

async function fetchDataDB() {
  if (tasks_computed === null || compute === null) {
    const respons = await getDataFromDB();
    tasks_computed = respons.tasks_computed;
    compute = respons.compute;
    name = respons.name
  }
  return { tasks_computed, compute, name };
}


async function changePageToSettings() {
  const content = await getContent();
  if (mainDiv.innerHTML = content.VideoStream) {
    console.log('changing page to settings');
    mainDiv.innerHTML = content.AccountSettings;
  }
}
  async function changePageToHome() {
    const content = await getContent();
    if (mainDiv.innerHTML = content.AccountSettings) {
      console.log("changing page to home")
      mainDiv.innerHTML = content.VideoStream;
    }
  }  
  
  async function showFrontPage() {
    const content = await getContent();
    mainDiv.innerHTML = content.VideoStream;
  }
  
  showFrontPage();
  