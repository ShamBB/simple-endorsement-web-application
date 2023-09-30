import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-champion-839b3-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endrosementDB = ref(database, "endorsementList");

const publishbtnEl = document.getElementById("publish-btn");
const fromInputEl = document.getElementById("from-input");
const toInputEl = document.getElementById("to-input");
const endorsementInputEl = document.getElementById("endorsement-input");
const endorsementformEl = document.getElementById("endorsement-form");
const endorsementListEl = document.getElementById("endorsement-list");
let likeID = [];
const likeIDfromLocalStorage = JSON.parse(localStorage.getItem("itemId"));

if (likeIDfromLocalStorage) {
  likeID = likeIDfromLocalStorage;
}

onValue(endrosementDB, function (snapshot) {
  if (snapshot.exists()) {
    const itemsObject = snapshot.val();
    let itemsArray = Object.entries(snapshot.val());
    clearEndorsementList();

    for (let i = 0; i < itemsArray.length; i++) {
      if (itemsArray[i]) {
        appendEndorsementList(itemsArray[i]);
      }
    }
  }
});

endorsementformEl.addEventListener("submit", function (event) {
  event.preventDefault();

  if (endorsementformEl.checkValidity()) {
    const newData = {
      comment: endorsementInputEl.value,
      from: fromInputEl.value,
      to: toInputEl.value,
      noOfLikes: 0,
    };
    push(endrosementDB, newData);
    clearForm();
  } else {
    //console.log("Form is not valid. Please correct the input.");
  }
});

function clearForm() {
  endorsementformEl.reset();
}

function clearEndorsementList() {
  endorsementListEl.innerHTML = "";
}

function appendEndorsementList(endorsementObject) {
  let itemID = endorsementObject[0];
  let itemValue = endorsementObject[1];

  //create new list
  let newEl = document.createElement("li");
  newEl.className = "endorsement-li";

  //set content inside new list
  newEl.innerHTML = `          
  <p class="to-txt">To ${itemValue.to}</p>
  <p class="endorsement-txt">
    ${itemValue.comment}
  </p>
  <p class="from-txt">From ${itemValue.from}</p>
  <p class="like-txt">
    <span class="love-icon">&#10084</span>
    <span class="like-txt-amount">${itemValue.noOfLikes}</span>
  </p>`;

  //attach listener to the love icon to update no of like
  const newSpanEl = newEl.querySelector(".love-icon");
  newSpanEl.addEventListener("click", function () {
    const isIdExist = checkIfIdexistinLocalStorage(itemID);
    if (isIdExist === false) {
      let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`);
      let counterLikes = itemValue.noOfLikes;
      counterLikes += 1;

      const updates = {
        noOfLikes: counterLikes,
      };
      update(exactLocationOfItemInDB, updates);
      addIdintoLocalStorage(itemID);
    } else {
      alert("already liked");
    }
  });

  endorsementListEl.append(newEl);
}

function addIdintoLocalStorage(id) {
  likeID.push(id);
  localStorage.setItem("itemId", JSON.stringify(likeID));
}

function checkIfIdexistinLocalStorage(id) {
  if (likeID.includes(id)) {
    return true;
  }
  return false;
}
