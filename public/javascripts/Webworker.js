let ws;
let subtasks_completed = 0;

// open ws connection and hand  er for "message" events
function openWsConnection() {
  ws = new WebSocket("ws://localhost:8001");
  let workerID = Math.floor(Math.random() * 1000);
  ws.addEventListener("message", (e) => {
    if (e.data === "0") {
      console.log("Not work to do, waiting for new jobs");
    } else {
      console.log(`You recieved task:\n` + e.data);
      let nextSubtask = JSON.parse(e.data);

      let alg = new Function("A", "B", nextSubtask.alg);

      let start_comp = Date.now();
      let solution = alg(nextSubtask.matrixA, nextSubtask.matrixB.entries);
      let end_comp = Date.now();

      //FORSØG
      subtasks_completed++;
      console.log("KIG HER " + subtasks_completed);
      subtasks_completed.innerText = subtasks_completed.toString();

      console.log(`Computation took ${(end_comp - start_comp) / 1000} s`);

      let subSolution = {
        workerID: workerID,
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

remember_if_yes
openWsConnection();

