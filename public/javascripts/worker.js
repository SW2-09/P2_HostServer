/*const checkboxes = document.querySelectorAll('input[name="option"]');
const checkboxElement = document.getElementById('checkboxYes')

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    checkboxes.forEach((c) => {
      if (c !== event.target) {
        c.checked = false;
      }
    });
  });
});

function handleChange(event) {
  const option = event.target.value;
  if (option === "yes" && event.target.checked) {
    if (typeof(w) == "undefined") {
      w = new Worker("/javascripts/Webworker.js");
      console.log("Worker is computing");
    }

  } else if (option ==="no" && event.target.checked) {
    console.log("Worker is not computing");
    w.terminate();
    w=undefined;
  } 
}
*/