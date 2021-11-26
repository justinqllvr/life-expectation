import "./style.css";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Main } from "./THREE";

//initialisation de la class THREE JS
const main = new Main();
//////////////////////////////////////////////////////////////////
//CUSTOM CURSOR
//////////////////////////////////////////////////////////////////
const mouseCursor = document.getElementsByClassName("cursor")
window.addEventListener("mousemove", (e) => {
  mouseCursor[0].style.top = e.pageY + "px"
  mouseCursor[0].style.left = e.pageX + "px"
  
})



//////////////////////////////////////////////////////////////////
//RECUPERATION DATA
//////////////////////////////////////////////////////////////////
fetch("/data.json")
  .then((res) => res.json())
  .then((res) => {
    const data = res;
  });

//////////////////////////////////////////////////////////////////
//KILL FEED
//////////////////////////////////////////////////////////////////
let kills = [];

for (let i = 0; i < 6; i++) {
  kills.push(document.getElementsByClassName(`kill_${i + 1}`));
}
kills.map((kill) => {
  kill[0].style.opacity = 0;
});

const killFeed = (killArray) => {
  kills.map((kill) => {
    kill[0].style.opacity = 0;
  });

  if (killArray.length <= 6) {
    for (let j = 0; j < killArray.length; j++) {
      if(kills[j][0].style.opacity !== 0) {
        console.log()
        kills[j][0].style.opacity = 1;
        kills[j][0].innerHTML = killArray[j];
      }
      
    }
  } else if (killArray.length > 6) {
    kills.map((kill) => (kill[0].style.opacity = 1));
    for (let k = 0; k < 6; k++) {
      kills[k][0].innerHTML = killArray[killArray.length - k - 1];
    }
  }
};

//////////////////////////////////////////////////////////////////
//NAVIGATION BAR
//////////////////////////////////////////////////////////////////
for (let i = 0; i < 9; i++) {
  document.getElementsByClassName(`nav_mark-${i}`)[0].style.top = `${i * 11}%`;
  document.getElementsByClassName(`nav_mark-${i}_text`)[0].style.top = `${
    i * 11
  }%`;
}

const navProgress = (progress) => {
  document.getElementById("nav_active").style.height = `${Math.floor(
    progress * 100
  )}%`;

  for (let i = 0; i < 9; i++) {
    if (
      parseInt(document.getElementsByClassName(`nav_mark-${i}`)[0].style.top) +
        i <
      Math.floor(progress * 100)
    ) {
      document.getElementsByClassName(
        `nav_mark-${i}`
      )[0].style.backgroundColor = "white";
      document.getElementsByClassName(`nav_mark-${i}_text`)[0].style.color =
        "white";
    } else {
      document.getElementsByClassName(
        `nav_mark-${i}`
      )[0].style.backgroundColor = "#63676D";
      document.getElementsByClassName(`nav_mark-${i}_text`)[0].style.color =
        "#63676D";
    }
  }
};
gsap.registerPlugin(ScrollTrigger);
const tween = gsap.to(".wrapper_content", {
  scrollTrigger: {
    trigger: ".wrapper_content",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      // console.log(self.progress);
      killFeed(main.deathList());
      main.updateScroll(self.progress);
      navProgress(self.progress);
    },
  },
});
//////////////////////////////////////////////////////////////////
//ROTATION MODELE PRESENTATION
//////////////////////////////////////////////////////////////////
const tweeny = gsap.to(".presentation_wrapper", {
  scrollTrigger: {
    trigger: ".presentation_wrapper",
    start: "-50%",
    end: "30%",
    scrub: true,
    onUpdate: (self) => {
      // console.log(self.progress);
      main.updateScroll1(self.progress);
    },
  },
});
