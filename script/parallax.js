const backgrounds = document.querySelectorAll("#background");
const header = document.querySelectorAll(".container");
const range = 20;

const calcValue = (a, b) => ((a / b) * range - range / 2).toFixed(1);

let timeout;
document.addEventListener(
  "mousemove",
  ({ x, y }) => {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(() => {
      const yValue = calcValue(y, window.innerHeight);
      const xValue = calcValue(x, window.innerWidth);

      [].forEach.call(header, (header) => {
        header.style.transform = `translateX(${xValue * 0.3}px) translateY(${
          yValue * 0.3
        }px)`;
        // header.style.transform = `translateX(0) translateY(0)`;
      });

      [].forEach.call(backgrounds, (background) => {
        background.style.backgroundPosition = `${-xValue * 0.1 - 5}vw ${
          -yValue * 0.1 - 5
        }vh`;
      });
    });
  },
  false
);
