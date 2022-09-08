// Create hidden menu
window.addEventListener("load", () => {
  let nav = document.createElement("nav");
  nav.id = "floatingNav";
  nav.style.opacity = "0";
  nav.style.display = "none";
  let mainURL = window.location.protocol + "//" + window.location.hostname;
  if (window.location.port) {
    mainURL = mainURL + ":" + window.location.port;
  }
  console.log(mainURL);

  let navDiv = document.createElement("div");
  navDiv.style.width = "fit-content";
  navDiv.style.zIndex = "5";
  nav.appendChild(navDiv);

  let navbartop = document.createElement("ul");
  navbartop.classList.add("nav");
  navbartop.classList.add("justify-content-center");
  navDiv.appendChild(navbartop);

  let title = document.createElement("h3");
  title.classList.add("mx-auto");
  title.classList.add("my-2");
  title.style.width = "fit-content";
  title.textContent = "Go To";
  title.onclick = () => {
    window.location = mainURL;
  };
  navDiv.appendChild(title);

  let navbarbottom = document.createElement("ul");
  navbarbottom.classList.add("nav");
  navbarbottom.classList.add("justify-content-center");
  navDiv.appendChild(navbarbottom);

  let linkContainers = [];
  for (let i = 0; i < 4; i++) {
    linkContainers[i] = document.createElement("li");
    linkContainers[i].classList.add("nav-item");
  }

  let contactLink = document.createElement("a");
  contactLink.classList.add("nav-link");
  contactLink.href = mainURL + "/contact/";
  contactLink.textContent = "Contact";

  let aboutLink = document.createElement("a");
  aboutLink.classList.add("nav-link");
  aboutLink.href = mainURL + "/about/";
  aboutLink.textContent = "About";

  let projectsLink = document.createElement("a");
  projectsLink.classList.add("nav-link");
  projectsLink.href = mainURL + "/projects/";
  projectsLink.textContent = "Projects";

  let blogLink = document.createElement("a");
  blogLink.classList.add("nav-link");
  blogLink.href = mainURL + "/blog/";
  blogLink.textContent = "Blog";

  linkContainers[0].appendChild(contactLink);
  linkContainers[1].appendChild(aboutLink);
  linkContainers[2].appendChild(projectsLink);
  linkContainers[3].appendChild(blogLink);

  for (let i = 0; i < 4; i++) {
    if (i < 2) {
      navbartop.appendChild(linkContainers[i]);
    } else {
      navbarbottom.appendChild(linkContainers[i]);
    }
    // console.log(linkContainers[i]);
  }
  let headerNavBG = document.createElement("div");
  headerNavBG.id = "floatingNavBG";
  nav.appendChild(headerNavBG);
  try {
    document.querySelector("body").append(nav);
    console.log("hidden nav appended");
  } catch (e) {
    console.log("hidden nav not appended");
  }
  gsap.registerPlugin(ScrollTrigger);
});

// Activate hidden menu
let mouse = {
  x: 0,
  y: 0,
};
// Store mouse position on page
document.onmousemove = (e) => {
  mouse = {
    x: e.clientX,
    y: e.clientY,
  };
};

// Outdated function (to be removed, still needed in touch events)
function getmouse() {
  let elemWidth = document.getElementById("floatingNav").clientWidth;
  let elemHeight = document.getElementById("floatingNav").clientHeight;
  gsap.to("#floatingNav", {
    y: mouse.y - elemHeight / 2,
    x: mouse.x - elemWidth / 2,
    duration: 0,
  });
}

let move = {
    xTo: 0,
    yTo: 0,
    xFrom: 0,
    yFrom: 0,
  }, // Stores the current position of the menu as well as where it will be going to (modified by triggerMenu)
  elem, // Stores information on the hidden menu, including itself and its dimensions
  hidden, // Timeout for hiding menu
  timer, // Timer for touch events
  firstNavTrigger = true; // If it is a first trigger (unused)

window.onload = () => {
  gsap.set(document.getElementById("floatingNav"), {
    opacity: 0,
    display: "block",
  });
  elem = {
    self: document.getElementById("floatingNav"),
    width: document.getElementById("floatingNav").clientWidth,
    height: document.getElementById("floatingNav").clientHeight,
  };
  gsap.set(document.getElementById("floatingNav"), {
    display: "none",
  });
};

// Triggers the menu when called
function triggerMenu() {
  clearTimeout(hidden);
  if (move.xFrom == 0 || move.yFrom == 0) {
    console.log("new trigger");
    move.xFrom = mouse.x - elem.width / 2;
    move.yFrom = mouse.y - elem.height / 2;
  } else {
    move.xFrom = move.xTo;
    move.yFrom = move.yTo;
  }
  move.xTo = mouse.x - elem.width / 2;
  move.yTo = mouse.y - elem.height / 2;

  gsap.to(elem.self, {
    opacity: 1,
    display: "block",
    duration: 1,
    ease: "power1.inOut",
  });
  gsap.fromTo(
    elem.self,
    { x: move.xFrom, y: move.yFrom },
    { x: move.xTo, y: move.yTo, duration: 0.5, ease: "power1.inOut" }
  );

  hidden = setTimeout(() => {
    gsap.to(elem.self, {
      opacity: 0,
      duration: 1,
      display: "none",
      ease: "power1",
    });
    move.xFrom = 0;
    move.yFrom = 0;
  }, 5000);
}

// Escape keypress
window.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    triggerMenu();
  }
});

// Touch events
window.addEventListener("touchstart", (e) => {
  if (
    e.type == "touchstart" ||
    e.type == "touchmove" ||
    e.type == "touchend" ||
    e.type == "touchcancel"
  ) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
  }
  timer = setTimeout(triggerMenu, 600);
});
window.addEventListener("touchend", () => {
  clearTimeout(timer);
}); // Stops short touches from firing the event)

// Hides menu on scroll
window.addEventListener("scroll", () => {
  gsap.to(elem.self, { opacity: 0, duration: 0.3, ease: "power1" });
});

// Alerts
let alertContainer = document.querySelector("#alerts");
// if (alertContainer !== null) {
//   console.log("alerts found");
// } else {
//   console.log("alerts not found");
//   try {
//     alertContainer = document.createElement("div");
//     alertContainer.id = "alerts";
//     alertContainer.style.opacity = 0;
//     document.body.appendChild(alertContainer);
//     console.log("alerts appended");
//   } catch (e) {
//     console.log("alerts not appended");
//   }
// }
try {
  let alert = document.createElement("div");
  alert.classList = "shadow alert alert-primary alert-dismissible fade show";
  alert.id = "alertMenu";
  alert.role = "alert";
  alert.innerHTML = `
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
    <span aria-hidden="true"></span>
  </button>
  <h3 style="font-size: medium;">🍔 Hidden Menu</h3>
  <p style="font-size: x-small;" class="mb-1">
    Did you know that you can press the escape key (or tap and hold on touchscreens) to open the hidden menu? Give it a try!
  </p>`;

  if (Math.random() > 0.9) alertContainer.appendChild(alert);
} catch (e) {
  console.log("alert not appended");
}
