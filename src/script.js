import "./style.css";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Main } from "./THREE";

let progress = 0
const progressHTML = document.getElementById("progress")
const img = document.getElementById("grid")
img.src="static/GRILLE.png"

const main = new Main()
// img.src="tjs_img2.gif";

// progressHTML.innerHTML(progress)

gsap.registerPlugin(ScrollTrigger);
const tween = gsap.to(".wrapper_content", {
  scrollTrigger: {
    trigger: ".wrapper_content",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: self => {console.log(self.progress);main.updateScroll(self.progress); document.getElementById("nav_active").style.height = `${Math.floor(self.progress * 100)}%`; }
  },
});
