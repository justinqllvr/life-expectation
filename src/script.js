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
  main.mouseRotation(e.pageX)
})
// window.addEventListener("scroll", (e) => {

//   console.log(window.scrollY)
// })

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
let pseudos = [];
let ages = [];
let kills = []

for (let i = 0; i < 6; i++) {
  pseudos.push(document.getElementsByClassName(`pseudo_${i + 1}`));
  ages.push(document.getElementsByClassName(`age_${i + 1}`));
  kills.push(document.getElementsByClassName(`kill_${i + 1}`));
}
kills.map((pseudo) => {
  pseudo[0].style.opacity = 0;
});

const killFeed = (pseudoArray, ageArray) => {
  kills.map((pseudo) => {
    pseudo[0].style.opacity = 0;
  });

  if (pseudoArray.length <= 6) {
    for (let j = 0; j < pseudoArray.length; j++) {
      if(kills[j][0].style.opacity !== 0) {
        console.log()
        kills[j][0].style.opacity = 1;
        pseudos[j][0].innerHTML = pseudoArray[j];
        ages[j][0].innerHTML = `${ageArray[j]} ans`;
      }
      
    }
  } else if (pseudoArray.length > 6) {
    kills.map((pseudo) => (pseudo[0].style.opacity = 1));
    let k = 0
    for (let l = 6; l > 0; l--) {
      if(k < 6) {
        console.log(pseudoArray.length - l)
        pseudos[k][0].innerHTML = pseudoArray[pseudoArray.length - l - 1];
        ages[k][0].innerHTML = `${ageArray[ageArray.length - l - 1]} ans`;
        k++
      }
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
      killFeed(main.deathList("pseudo"), main.deathList("age"));
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
      main.updateScroll1(self.progress);
    },
  },
});

let gradientTop = document.getElementsByClassName("gradient_top")
let gradientBottom= document.getElementsByClassName("gradient_bottom")


const tweeni = gsap.to(".presentation_wrapper", {
  scrollTrigger: {
    trigger: ".presentation_wrapper",
    start: "-100%",
    end: "90%",
    scrub: true,
    onUpdate: (self) => {
      if(self.progress  > 0.95) {
        gradientTop[0].style.display = "block"
      } else {
        gradientTop[0].style.display = "none"
      }
      if(self.progress > 0.35) {
        gradientBottom[0].style.display = "block"
      } else {
        gradientBottom[0].style.display = "none"
      }

    },
  },
});

window.addEventListener('load', (e) => {
  gradientBottom[0].style.display = "none"
})