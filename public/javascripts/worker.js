const checkboxes = document.querySelectorAll('input[name="option"]');
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
  const checkboxes = document.getElementsByName("option");

  if (option === "yes" && event.target.checked) {
    if (typeof(w) == "undefined") {
      w = new Worker("/javascripts/Webworker.js");
      console.log("Worker is computing");
    }

    checkboxes[1].checked = false;
  } else if (option === "no" && event.target.checked) {

    console.log("Worker is not computing");
    w.terminate();
    w=undefined;
    checkboxes[0].checked = false;
  } 
}