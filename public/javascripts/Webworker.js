let ws;
let subtasks_completed = 0;
let counter = 0;

// open ws connection and hander for "message" events
/**
 * Opens a WebSocket connction to `ws://localhost:3443` and handles incomming `message` events.
 *
 * @throws {Error} If there's an HTTP error when updating tasks in the database.
 */
async function openWsConnection() {
    ws = new WebSocket("ws://localhost:3443");
    let workerId;
    onmessage = async function (e) {
        console.log("messagge received from main");
        console.log(e.data.userId);
        workerId = e.data.userId;
    };

    //Event listener for messages from WebSocket server.
    ws.addEventListener("message", async (e) => {
        if (e.data === "connected") {
            ws.send(`{"data": "connected",
            "workerId": "${workerId}"}`);
        } else if (e.data === "standby") {
            console.log("Not work to do, waiting for new jobs");
            setTimeout(() => {
                ws.send(`{"data": "ready for work",
                  "workerId": "${workerId}"}`);
            }, 5000);
        } else {
            let nextSubtask = JSON.parse(e.data);
            console.log(`You recieved task\n
                         jobId: ${nextSubtask.jobId}
                         Subtask: ${nextSubtask.taskId}`);

            let alg = new Function("A", "B", nextSubtask.alg);
            let solution;
            switch (nextSubtask.jobType) {
                case "matrixMult": {
                    // let start_comp = Date.now();
                    solution = alg(
                        nextSubtask.data,
                        nextSubtask.commonData.entries
                    );
                    // let end_comp = Date.now();
                    break;
                }
                case "plus": {
                    // let start_comp = Date.now();
                    solution = alg(nextSubtask.data[0], nextSubtask.data[1]);
                    // let end_comp = Date.now();
                    break;
                }
                default:
                    ws.send('{"data": "ready for work"}');
                    break;
            }

            let jobId = nextSubtask.jobId;
            let taskId = nextSubtask.taskId;

            let subSolution = {
                workerId: workerId,
                jobId: jobId,
                taskId: taskId,
                solution: solution,
            };

            try {
                ws.send(JSON.stringify(subSolution));
                counter++;
                console.log(
                    `A subsolution was send by worker: ${subSolution.taskId}`
                );
                const respons = await fetch("/worker/updateTasksComputedDB", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!respons.ok) {
                    throw new Error("HTTP error " + respons.status);
                }
            } catch (err) {
                console.log(err);
            }
        }
    });
}

/**
 * Closes the ws connection
 *
 * @param {WebSocket} ws - The WebSocket connection to close.
 */
function stopWsConnection(ws) {
    ws.close();
}

//add event listener to get workerID

// remember_if_yes
openWsConnection();
