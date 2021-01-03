'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault(); // prevents scroll up when clicked defaultly
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////// SMOOTH SCROLLING -when clicking learn more- scroll the page

btnScrollTo.addEventListener('click', function (e) {
  // first, we need to get to corrdionates the element we want to get to
  //const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords); //this will show positon of elements from top, bottom of page weivport
  // console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/witth viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  // we can get coordinate information with these codes as well
  //we need these cordinates to tell JS where to scroll
  ///////// ikd school way ///////
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); //first parameter is left, second one is top
  // thise works only when we are top of the page 'cuz top is relative to viewport, not documents top
  //when we click in middle scrolling, it wont work, will bring us half way
  // to prevent this, we need to add position between top of section and document

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  ///////////// new way///////
  section1.scrollIntoView({ behavior: 'smooth' });
  // scroll to selected section with a smotth effect/
});

/// Page Navigation//////

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); // prevents going to anchor #section--1/3 when clicking
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     //travels the section clicked smoothly but this method is not efficent. with for each method we make copy for each menu. if we had 10k event, we needed to create 10k copy. to prevent this, we use event delegetion
//   });
// });

// 1. add event listener to commmon parent element

// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);

  // matching stragegy

  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// we simply added one eventlistener to parent event and listened if clicks is interested to us then event happens instead of adding event listener all elements we are looking for.

//// Tabbed Components // - Section 2 - //////////

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // we use closest 'cuz tab has a span element in it and we click number(span) we want to select tab as well

  //Guard Clause
  if (!clicked) return;
  //if there is no clicked return immediately. guard clause. if there is nothing clicked finish funtion and not other codes will be executed. it is modern way of writing fallowing codes:
  // if (clicked) {
  //   clicked.classList.add('operations__tab--active');
  // }
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  //first we remove active tab styles from all tabs
  clicked.classList.add('operations__tab--active');
  //then add active tab styles (class) to clicked tab

  //remove active style from all content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  // classname with starting data has a special property called dataset. check previous lectures.
});

/// Menu fade animations

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // since there is no child element in nav__link, we dont need to use closest element
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // we select sibling with closest method. going an higher up node will be working even menu changes in future.
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
// event listener expect a funtiion here but simply writing handleHover function with argument would not work. that function can get only one argument which is "event". so we use .bind method which turn handleHover into a function with desired argument (opacity)
// study this later more.

nav.addEventListener('mouseout', handleHover.bind(1));

/////////////// sticky navigation ///////////////

//with scroll event - causes bad performance.

// const initialCoords = section1.getBoundingClientRect();

// console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// intersection Observer API////////

// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////// Reveal Sections ////////////

const allSections = document.querySelectorAll('.section');

const revealedSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
  // once our job is done, we dont want browser observe again.
};

const sectionObserver = new IntersectionObserver(revealedSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //  section.classList.add('section--hidden');
});

///// Lazy Load Images //////////

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //  console.log(entry);

  if (!entry.isIntersecting) return;

  // replace src with data-src images
  entry.target.src = entry.target.dataset.src;

  // entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////// BUILDING SLIDER //////

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // keyboard event

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // shortcurciut version. both works just as fine.
  });

  // dots under slide

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();
};
slider();
/*
//////////////LECTURES///////////////
//////// SELECTING ELEMENTS ////////////

console.log(document.documentElement); // select all elements in html document
console.log(document.head); // select part of html document
console.log(document.body);

const header = document.querySelector('.header'); // select a part with .header class
const allSections = document.querySelectorAll('.section'); // select all elements with section class

console.log(allSections);

// these method won't be needing element sign . or # like query selector since it is already defined by selector.
document.getElementById('section--1'); // select element with its ID

const allButtons = document.getElementsByTagName('button'); // select all elements with button name
// this will create a HTMLCollection which will be updated automaticly. With querySelectorAll it creates a nodeList which wont be updated.
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

////////////// CREATING AND INSERTING ELEMENTS //////////

// insertAdjacentHTML - seen in Bankist App

const message = document.createElement('div');
// this div element is created and stored in message but not used in any where and not anywhere in dom. we need to manually add to page if we want to in it


/*
message.classList.add('cookie-message'); // add a class to element (we just created)
message.textContent =
  'We use cookies for improved functionality and analytics.'; // add text to element
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

//header.prepend(message); // we just inserted message element to header of html document
// prepend add selected element as the first child of element
header.append(message); // add as a last child but first one dissappeared. message is a life element which cant be in multiple place in document at the same time. append basicly moved the element cuz prepend insterted it.
//header.append(message.cloneNode(true)); // if we want to be multiple places, we need to clone it.

//header.before(message); // add element before selected element
//header.after(message); // after selected element

//////////// DELETE ELEMENTS //////////

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    //message.parentElement.removeChild(message);
    // old way of removing elements. called Dom traversing.
  });

// wehen we click button on message (got it) message element will be removed.
*/

/*
//////////// STYLES /////////////

message.style.backgroundColor = '#37383d';
message.style.width = '104%';

console.log(message.style.height); // wont see anything
console.log(message.style.backgroundColor); // this works for only inline style codes.

console.log(getComputedStyle(message).height); // only way we can get style

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';
// since hight is a string we convert it into a number with Number.parseFloat

// custom properties. we can change profery values defined in documents.

document.documentElement.style.setProperty('--color-primary', 'orangered');

// attribues (src, class, alt, id etc)

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);
console.log(logo.src);
console.log(logo.designer); // only standart properties can be read - undefined
console.log(logo.getAttribute('designer')); // can be read from html (not css)

// as we can read these attributes, we can also set them

logo.alt = 'Beautfil minimalist logo';
logo.setAttribute('company', 'Bankist'); // we can add attribues as well

console.log(logo.src); //http://127.0.0.1:5500/img/logo.png
console.log(logo.getAttribute('src')); //img/logo.png
//somethimes we need to get relative information so get attribue is way to go in these cases

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // http://127.0.0.1:5500/index.html#
console.log(link.getAttribute('href')); // #

////////// DATA ATTRIBUES ///////////

//attribues with starting date always stored in dateset property.
console.log(logo.dataset.versionNumber); //3.0

///////// CLASSES ///////////

logo.classList.add('c', 'd');
logo.classList.remove('c', 'd');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// we can use this but dont use this, it will override whatever there
//logo.className = 'bilal'


//////// EVENTS //////////

// click, mouse moving etc generates events. we can listen these event with event listener and add actions.

/////// MOUSEENTER EVETS (LIKE HOVER) ////////

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading');

  //h1.removeEventListener('mouseenter', alertH1);
  // we remove event from happening second time. this function also makes it superior from onmouseenter function down.
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
//we can add a timer to remove eventlistener as well

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading');
// };
// // this wasy is oldschool. addEventListener is used now.

//////// CAPTURING PHASE AND BUBBLING PHASE - event prpagation ////////

// events created in root documents and travels thro dom tree until the target element. (for example click on a link) then travel thro to root again by visiting all parents elements. if we add the same event on parents, it will happen twice. first phase is capturing phase, second one is bubling phase. 


const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)}, ${randomInt(0, 255)})`;

console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  //e.stopPropagation();
  //stopping propagations prevents event travel thro parents elements but not a good idea.
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Nav', e.target, e.currentTarget);
});



//////////// DOM TRAVERSING ////////
//we can select an element based on another element. sometimes we need to select some elements relative to other elements: direct child or parent. for this we need doom traversing

const h1 = document.querySelector('h1');

// going downwards: selecting child by querySelector which works also on elements not only on document

console.log(h1.querySelectorAll('.highlight'));

// this will work no matter how deep child element is. elements with .hightlight not child of h1 will not be seleccted

console.log(h1.childNodes); // shows all child nodes of h1 element. nodes can be anything.
console.log(h1.children); // html collection; life colletion. this will work for only direct children

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// we can also use this method to chose or chage child elements

// Going upwards: parents

console.log(h1.parentNode); // h1 is inside header title. we can go upword
console.log(h1.parentElement);

// sometimes we need find a parent element not just 1 step up. it will select closest parent element with the given parameters

h1.closest('.header').style.background = 'var(--gradient-secondary';

// parent of h1 is div but want to go to header.

h1.closest('h1').style.background = 'var(--gradient-primary'; // will select itself

// this is simply opposite of querySelector. query finds child, closest find parent. both goes deep

// going sideways: selecting siblings.

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// by nature of JS we can only go only one sibling each way.
// same method for nodes. most of the time we will be working with elements
console.log(h1.previousSibling); // text
console.log(h1.nextSibling); // text

// if we want to know all siblings, we go to parents then read all children
console.log(h1.parentElement.children);

//html collection can be turned into an array and we can do some work on them. 
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});

// in this example we selected all siblings of h1 and slaled them 0.5 (make them smaller)
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// when html and js loaded and working. sometimes all page wrapped into this function
// since we add js tag at the end of the page that is usually necessary cuz it will be read last anyway

window.addEventListener('load', function (e) {
  console.log('Page full loaded', e);
});

// when a page with css and images fully loaded.

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; //asks user if it is sure to leave the page
// });
