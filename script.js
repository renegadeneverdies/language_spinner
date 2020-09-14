var button = document.getElementById("button");
var slots = [1,2,3].map(x => document.getElementById("item"+x));
var slotAnimations = slots.map(x => new Animation(spinSlotbox(x, 50)), document.timeline);
var instruction = "none";
var makeWin = document.getElementById("makeWin");
var makeJackpot = document.getElementById("makeJackpot");
var jackpotPic = "pic2.png";
var spinL = 4000;

button.addEventListener("click", spinAll, false);
makeWin.addEventListener("click", function() { instruction = "win" }, false);
makeJackpot.addEventListener("click", function() { instruction = "jackpot" }, false);

function generate() {
  let n = Math.floor(Math.random() * 4);
  return ("pic" + n + ".png");
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

function swap(item) {
  item.children[0].src = item.children[1].src;
  item.children[1].src = generate();
}

function swapRigged(item, val) {
  item.children[0].src = item.children[1].src;
  item.children[1].src = val
}

function spinAll() {
  // it should be impossible to play if bet is greater than balance
  // but I'm clement enough to give you a last chance. use it wisely
  if (parseInt(document.getElementById("balance").value) > 0) {
    let spinning = new Audio('sounds/spinning.WAV');
    spinning.play();
    let intId = setInterval(avalanche, 50);
    setTimeout(function() { clearInterval(intId) }, spinL);
    let items = scoped(slots, "-2");
    if (instruction === "jackpot") {
      setTimeout(function() { slots.map(x => swapRigged(x, jackpotPic)) }, spinL);
      setTimeout(jackpot, spinL);
    }
    else if (instruction === "win") {
      setTimeout(function() { slots.map(x => swapRigged(x, items[0].src)) }, spinL);
      setTimeout(result, spinL);
    }
    else { setTimeout(result, spinL) };
  }
  else { alert("You can't play anymore") };
}

function avalanche() {
  slotAnimations.map(x => x.play());
  slots.map(x => swap(x));
}

function checkSlots(slotList) {
  let items = srcList(scoped(slotList, "-2"), "/");
  if (items.reduce(jackpotReducer(items[0], jackpotPic))) { return "jackpot" }
  else if (items.reduce(winReducer(items[0]))) { return "win" }
  else { return "lose" }
}

function scoped(array, suffix) {
  return array.map(x => document.getElementById(x.id + suffix));
}

function srcList(array, sep) {
  return array.map(x => x.src.split(sep).pop());
}

function jackpotReducer(first, jackpot) {
  return (acc, cur) => cur === jackpot && acc && first === jackpot;
}

function winReducer(win) {
  return (acc, cur) => cur === win && acc;
}

function result() {
  let bet = document.getElementById("bet")
  let balance = document.getElementById("balance");
  switch (checkSlots(slots)) {
    case "jackpot":
      balance.value = (parseInt(balance.value) + jackpot(bet.value)).toString();
      break;
    case "win":
      balance.value = (parseInt(balance.value) + win(bet.value)).toString();
      break;
    case "lose":
      balance.value = (parseInt(balance.value) - lose(bet.value)).toString();
      break;
  }
}

function jackpot(bet) {
  let sound = new Audio('sounds/jackpot.WAV');
  sound.play();
  return (parseInt(bet) * 100);
}

function win(bet) {
  let sound = new Audio('sounds/win.WAV');
  sound.play();
  return (parseInt(bet) * 10);
}

function lose(bet) {
  let sound = new Audio('sounds/lose.WAV');
  sound.play();
  return parseInt(bet);
}
