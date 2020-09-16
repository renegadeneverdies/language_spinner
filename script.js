var button = document.getElementById("button");
var makeWin = document.getElementById("makeWin");
var makeJackpot = document.getElementById("makeJackpot");
var slots = [1,2,3].map(x => document.getElementById("item" + x));
var slotAnimations = slots.map(x => new Animation(spinSlotbox(x, 50)), document.timeline);
var instruction = "none";
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

function swap(item, val) {
  item.children[0].src = item.children[1].src;
  item.children[1].src = val;
}

function spinAll() {
  if (parseInt(document.getElementById("balance").value) > 0) {
    let spinning = new Audio('sounds/spinning.WAV');
    spinning.play();
    let intId = setInterval(avalanche, 50);
    setTimeout(function() { clearInterval(intId) }, spinL);
    let items = slots.map(x => document.getElementById(x.id + "-2"));
    if (instruction === "jackpot") setTimeout(function() { slots.map(x => swap(x, jackpotPic)) }, spinL)
    else if (instruction === "win") setTimeout(function() { slots.map(x => swap(x, items[0].src)) }, spinL);
    setTimeout(result, spinL);
  }
  else alert("You can't play anymore");
}

function avalanche() {
  slotAnimations.map(x => x.play());
  slots.map(x => swap(x, generate()));
}

function checkSlots(slotList) {
  let scoped = slotList.map(x => document.getElementById(x.id + "-2"))
  let items = scoped.map(x => x.src.split("/").pop());
  if (items.reduce(winReducer(items[0], jackpotPic))) return "jackpot"
  else if (items.reduce(winReducer(items[0], items[0]))) return "win"
  else { return "lose" };
}

function winReducer(first, win) {
  return (acc, cur) => cur === win && acc && first === win;
}

function result() {
  let bet = document.getElementById("bet")
  let balance = document.getElementById("balance");
  let result = checkSlots(slots);
  if (result === "jackpot") balance.value = (parseInt(balance.value) + congrats(bet.value, 100, "jackpot.WAV")).toString();
  if (result === "win") balance.value = (parseInt(balance.value) + congrats(bet.value, 10, "win.WAV")).toString();
  if (result === "lose") balance.value = (parseInt(balance.value) - congrats(bet.value, 1, "lose.WAV")).toString();
}

function congrats(bet, mult, sound) {
  let audio = new Audio("sounds/" + sound);
  audio.play();
  if (instruction === "none") return parseInt(bet) * mult
  else return 0;
}
