function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const container = document.getElementsByClassName("container")[0];

setInterval(() => {
  const elems = Array(document.getElementsByClassName("elem"));
  const newElems = new Array();
  elems[0][1].classList.remove("main__elem");
  newElems[1] = elems[0][2];
  newElems[2] = elems[0][0];
  newElems[0] = elems[0][1];

  elems[0][2].classList.add("move-up");
  elems[0][1].classList.add("move-up");
  elems[0][2].classList.add("main__elem");
  elems[0][0].classList.add("move-down");
  sleep(1000).then(() => {
    elems[0][2].classList.remove("move-up");
    elems[0][1].classList.remove("move-up");
    elems[0][0].classList.remove("move-down");

    container.replaceChild(newElems[0], elems[0][0]);
    container.replaceChild(newElems[1], elems[0][1]);
    container.appendChild(newElems[2]);
  });
}, 7000);
