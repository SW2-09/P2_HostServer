let tasks_computed = null;
let compute = null;

const mainDiv = document.getElementById("mainDiv");

function content() {
  


}

/*
VideoStream: `
<div class="frontpage">
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
    </div>
`,
      
AccountSettings:`
    <div class="frontpage">
      <div class="right">
        <div class="userinfo">
          <h2>Account Settings</h2>
        </div>
        <div class="compute">
          <div class="header">
          <h3>Subscription details</h3> 
          </div>
          <div>
          {<% if (${compute}) { %>
            <div class="computeYes" id="computeYes">
              You are currently computing while watching GridFlix
              <input type="checkbox" name="option" value="yes"  checked>
              <input type="button" name="changeCompute" id="changeCompute" class="changeCompute" value="Change subscription details"> 
            </div>
          <% } else { %>
            <div class="computeNo" id="computeNo">
              You are currently not computing while watching GridFlix
              <%= compute %>
              <input type="checkbox" name="option" value="no" checked>
              <input type="button" name="changeCompute" id="changeCompute" value="Change subscription details">

            </div>
          <% } %>}
        </div>
        <br />
        <div class="subtasks">
          <div class="header">
            <h3>Contribute History</h3>
          </div>
          Number of subtasks completed: <%= tasks_computed %>
        </div>
        <br />
        <div class="points">
          <div class="header">
            <h3>Subscription</h3>
          </div>
          Points obtained: <span id="pointsObtained">0</span>
        </div>
      </div>
    </div>`,
};
*/


async function getDataFromDB(){
  let DBdata
  let respons = await fetch('/worker/updateDB')
    if(!respons.ok){
      throw new Error("HTTP error " + respons.status);
    } const data = await respons.json();
    console.log(data);
    return data;
}

async function fetchDataDB() {
  if(tasks_computed === null || compute === null){
    let respons = await getDataFromDB() ;
    tasks_computed = respons.tasks_computed;
    compute = respons.compute;
    console.log(tasks_computed);
    console.log(compute);
  }
}

async function changePageToSettings() {
  await fetchDataDB();
   if (mainDiv.innerHTML = content.VideoStream) {
      mainDiv.innerHTML = content.AccountSettings;
  }
  }

function changePageToHome() {
  if (mainDiv.innerHTML = content.AccountSettings) {
      mainDiv.innerHTML = content.VideoStream;
  }
  }
  

mainDiv.innerHTML = content.VideoStream;


