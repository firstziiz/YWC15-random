const LOCAL_STORAGE_KEY = 'ywc-15-random'
// Create Machine Element

const storage = window.localStorage
const saved = storage.getItem(LOCAL_STORAGE_KEY)

let items;
let slides = {};

// if has save in localStorage
if (saved) {
  items = saved.split(',');
} else {
  items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
  updateStorage();
}

function updateStorage() {
  storage.setItem(LOCAL_STORAGE_KEY, items.join(','));
}

// create Wheel
function createWheel() {
  const wheelEl = document.createElement('wheel')
  return wheelEl
}

function random() {
  return Math.floor(Math.random() * ((items.length - 1) - 0 + 1)) + 0
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const beginRandom = (isFirst = false, isSecond = false) => {
  // Song
  // let waitingSong = document.getElementById('audio-waiting')
  // setTimeout(function() {
  //   waitingSong.pause()
  // },1000)
  let randomSong = document.getElementById('audio-baby-shark')
  randomSong.currentTime = 0
  randomSong.play()
  // Speed UP!
  $('.props-1').css('animation-duration', `20s`);
  $('.props-2').css('animation-duration', `5s`);
  $('.props-3').css('animation-duration', `20s`);
  $('.props-3-inner').css('animation-duration', `7s`);
  // ending

  hideRandomButton();
  let randIdx;
  const getSpinDegree = getSpin(randIdx, false);
  const wheel = $('wheel')[0];
  setWheelRotate(wheel, -getSpinDegree);
  let swapCount = 0;
  const maximunCount = randomRange(7, 15);
  let currentTransSpeed = 15;
  setTransforSpeed(currentTransSpeed);

  const interval = setInterval(() => {
    // const shouldReverse = randomRange(0, 5) >= 3;
    // if (shouldReverse) {
    //   swapCount += 1;
    //   currentTransSpeed += 1;
    //   setTransforSpeed(currentTransSpeed);
    //   const getNewDegree = getSpin(randIdx, swapCount % 2 === 1);
    //   setWheelRotate(wheel, swapCount % 2 === 0 ? getNewDegree : -getNewDegree);
    // }
    // if (swapCount === maximunCount) {
    //   clearInterval(interval);
    //   currentTransSpeed += 15;
    //   setTransforSpeed(currentTransSpeed);
    // }
    if (currentTransSpeed >= 15) {
      currentTransSpeed = 15;
      clearInterval(interval);
    } else {
      currentTransSpeed += 2;
    }
    setTransforSpeed(currentTransSpeed);
    console.log(currentTransSpeed);
  }, 1000);
  
  $(wheel).bind(
    "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
    function(){
      $('#audio-choosed')[0].play()
      showResetButton(randIdx, isFirst);

      // let randomSong = document.getElementById('audio-random')
      // $('#audio-waiting')[0].currentTime = 0
      // $('#audio-waiting')[0].play()
      // setTimeout(function() {
      //   randomSong.pause()
      // },1000)

      // Speed Down!
      $('.props-1').css('animation-duration', `50s`);
      $('.props-2').css('animation-duration', `10s`);
      $('.props-3').css('animation-duration', `50s`);
      $('.props-3-inner').css('animation-duration', `20s`);
      // ending
      
    }
  );
}

function setTransforSpeed(s) {
  console.log($('wheel')[0]);
  $('wheel').css('transition-duration', `${s}s`);
}

function getTargetDegree(index, isReverse) {
  return isReverse ? - slides[Object.keys(slides)[index]] : - 360 + slides[Object.keys(slides)[index]];
}

function getSpin(idx, isReverse) {
  const amountRounds = randomRange(100 , 120);
  const degree = 360 * amountRounds

  return isReverse ? degree : -degree + getTargetDegree(idx, isReverse);
}

function setWheelRotate(wheel, degree) {
  // const style = `transform: `;
  // wheel.setAttribute('style', style)
  $('wheel').css('transform', `translateZ(-84vmax) rotateY(${degree}deg)`);
}

// Create Slide
function createSlide(index, angle, team) {
  let slideEl = document.createElement('slide')
  const degree = index * angle

  slideEl.classList.add('character')

  Object.assign(slides, {
    [team]: degree,
  })

  const style = `transform: rotateY(${degree}deg)
  translateZ(80vmax);`

  // Set slide element attribute
  slideEl.setAttribute('style', style)
  slideEl.setAttribute('data-deg', degree)
  slideEl.setAttribute('data-team', team)
  // Set slide text context
  slideEl.innerHTML = `<div><img class="team team-${team}" src="./assets/img/${team}.png" /></div>`
  return slideEl
}


function showRandomButton(isFirst, isSecond) {
  $('#action-btn').show();
  $('#action-btn').click(() => beginRandom(isFirst, isSecond));
}

function hideRandomButton() {
  $('#action-btn').hide();
  $('#action-btn').prop('onclick',null).off('click');
}

function showResetButton(removeIdx, isFirst) {
  $('#reset-btn').show();
  $('#reset-btn').click(() => {
    clear(removeIdx);
    initiate(false, isFirst);
  });
}

function hideResetButton() {
  $('#reset-btn').hide();
  $('#reset-btn').prop('onclick',null).off('click');
}

function initiate(isFirst = false, isSecond = false) {

//   $('#audio-waiting')[0].currentTime = 0
//   $('#audio-waiting')[0].play()
//   $('#audio-waiting')[0].addEventListener('ended', function() {
//     this.currentTime = 0;
//     this.play();
// }, false);

  const wheel = createWheel()
  const anglePerSlide = 360 / items.length
  items.forEach((item, index) => {
    const slide = createSlide(index, anglePerSlide, item)
    wheel.appendChild(slide);
  })
  const machineEl = $('#root')[0];
  machineEl.appendChild(wheel);
  hideResetButton();
  showRandomButton(isFirst, isSecond);
}

function clear(removedIdx) {
  const root = $('#root')[0];
  root.removeChild(root.childNodes[0]);
  items = [
    ...items.slice(0, removedIdx),
    ...items.slice(removedIdx + 1),
  ];
  items = shuffle(items)
  updateStorage();
  slides = {};
}

// Main code
(() => {
  initiate(true);
})()

// the modern version of the Fisher–Yates shuffle algorithm:
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}