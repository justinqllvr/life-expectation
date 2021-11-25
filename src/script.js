import "./style.css";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Main } from "./THREE";

//////////////////////////////////////////////////////////////////
//RECUPERATION DATA
fetch("/data.json")
  .then((res) => res.json())
  .then((res) => {
    const data = res
  });
//////////////////////////////////////////////////////////////////
//NAVIGATION BAR
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
const main = new Main();
gsap.registerPlugin(ScrollTrigger);
const tween = gsap.to(".wrapper_content", {
  scrollTrigger: {
    trigger: ".wrapper_content",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      // console.log(self.progress);
      main.updateScroll(self.progress);
      navProgress(self.progress);
    },
  },
});
