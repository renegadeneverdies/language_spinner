function generate() {
  let n = Math.floor(Math.random() * 4);
  return ("pictures/pic" + n + ".png");
}

function spinSlotbox(item, duration) {
  let slotDownKeyframes = new KeyframeEffect(
    item,
    [
      { transform: 'translateY(0%)' },
      { transform: 'translateY(-50%)'}
    ],
      { duration: duration, fill: 'forwards' }
  );
  return slotDownKeyframes;
}

var button = document.getElementById("button");
var slots = [1,2,3].map(x => document.getElementById("item"+x));
var slotAnimations = slots.map(x => new Animation(spinSlotbox(x, 50)), document.timeline);

button.addEventListener("click", spinAll, false);

function swap(item) {
  item.children[0].src = item.children[1].src;
  item.children[1].src = generate();
}

function spinAll() {
  let spinning = new Audio('sounds/spinning.WAV');
  spinning.play();
  let intId = setInterval(avalanche, 50);
  setTimeout(function() { clearInterval(intId) }, 4000);
  setTimeout(result, 4000);
}

function avalanche() {
  slotAnimations.map(x => x.play());
  slots.map(x => swap(x));
}

function checkSlots(slotList) {
  let js = "pic2.png";
  let items = srcList(scoped(slotList, "-2"), "/");
  if (items.reduce(jackpotReducer(js))) { return "jackpot" }
  else if (items.reduce(winReducer(items[0]))) { return "win" }
  else { return "lose" }
}

function scoped(array, suffix) {
  return array.map(x => document.getElementById(x.id + suffix));
}

function srcList(array, sep) {
  return array.map(x => x.src.split(sep).pop());
}

function jackpotReducer(jackpot) {
  return (acc, cur) => cur === jackpot && acc;
}

function winReducer(win) {
  return (acc, cur) => cur === win && acc;
}

function result() {
  switch (checkSlots(slots)) {
    case "jackpot":
      let jackpot = new Audio('sounds/jackpot.WAV');
      jackpot.play();
      break;
    case "win":
      let win = new Audio('sounds/win.WAV');
      win.play();
      break;
    case "lose":
      let lose = new Audio('sounds/lose.WAV');
      lose.play();
      break;
  }
}
