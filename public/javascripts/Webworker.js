let ws;
let subtasks_completed = 0;

// open ws connection and hand  er for "message" events
async function openWsConnection() {
  ws = new WebSocket("ws://localhost:3443");
  let workerId;
  onmessage = function(e) {
    console.log("messagge received from main")
    console.log(e.data.userId)
    workerId = e.data.userId;
  };
  ws.addEventListener("message", (e) => {
    if (e.data === "0") {
      console.log("Not work to do, waiting for new jobs");
      setTimeout(() => {
        ws.send('{"data": "ready for work"}');
      }, 10000);
    } else {
      console.log(`You recieved task:\n` + e.data);
      let nextSubtask = JSON.parse(e.data);
      
      let alg = new Function("A", "B", nextSubtask.alg);
      let solution;
      switch (nextSubtask.jobType) {
        case "matrixMult":{
          // let start_comp = Date.now();
          solution = alg(nextSubtask.data, nextSubtask.commonData.entries);
          // let end_comp = Date.now();
          break;
        }
        case "plus":{
          // let start_comp = Date.now();
          solution = alg(nextSubtask.data[0], nextSubtask.data[1]);
          // let end_comp = Date.now();
          break;
        }
      
        default:
          ws.send('{"data": "ready for work"}');
          return ws;
      }
      
      
      let jobId = nextSubtask.jobId;
      let taskId = nextSubtask.taskId;

      //FORSØG
      subtasks_completed++;
      console.log("KIG HER " + subtasks_completed);
      subtasks_completed.innerText = subtasks_completed.toString();

      // console.log(`Computation took ${(end_comp - start_comp) / 1000} s`);

      let subSolution = {
        workerId: workerId,
        jobId: jobId,
        taskId: taskId,
        solution: solution,
      };

      ws.send(JSON.stringify(subSolution));
      // updateUserTasksComputed();
      console.log(`A subsolution was send by worker: ${subSolution.workerID}`);
    }
  });
  return ws;
}

// Stops the websocket connection
function stopWsConnection(ws) {
  ws.close();
}

//add event listener to get workerID

// remember_if_yes
openWsConnection();

