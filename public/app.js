document.addEventListener("DOMContentLoaded", () => {
  let app = firebase.app();

  fetch("http://localhost:5001/toms-cloud-functions/us-central1/api/dog").then(
    console.log
  );
});
