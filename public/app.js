document.addEventListener("DOMContentLoaded", () => {
  let app = firebase.app();

  // how to fetch the dog resource from the http api we created in http.ts
  fetch("http://localhost:5001/toms-cloud-functions/us-central1/api/dog").then(
    console.log
  );

  // HOW TO CALL A FIREBASE CALLABLE FUNCTION

  // get reference to function that we created named "sendText"
  const sendText = firebase.functions().httpsCallable("sendText");
  // firebase function will ensure that the user is authenticated on the frontend and backend
  sendText({ message: "hello" });
});
