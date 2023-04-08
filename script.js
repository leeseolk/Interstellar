class Slider {
  constructor() {
    this.bind();

    this.el = document.querySelector('.js-slider');
    this.slides = [...this.el.querySelectorAll('.js-slide')];
    this.pagination = this.el.querySelector('.js-slider__pagination');

    this.cache = null;
    this.bulletCache = null;

    this.last = 0;
    this.current = 0;
    this.total = 0;
    this.isAnimating = false;
    this.forward = true;

    TweenMax.set(this.slides[this.current], { autoAlpha: 1 });

    this.init();
  }

  bind() {
    ['changeSlide'].
    forEach(fn => this[fn] = this[fn].bind(this));
  }

  setCache() {
    this.cache = [];
    this.total = this.slides.length - 1;
    this.slides.forEach(el => {
      const elem = {
        el: el,
        state: false,
        elems: el.querySelectorAll('.js-slide__item') };


      this.cache.push(elem);
    });
  }

  changeSlide(e) {
    if (this.isAnimating) return;
    const delta = e.deltaY;

    if (delta > 0) {
      this.nextSlide();
    } else if (delta < 0) {
      this.prevSlide();
    }
  }

  nextSlide() {
    if (this.current === this.total) return;
    this.last = this.current;
    this.current = this.current + 1;
    this.forward = true;

    this.animateSlide();
  }

  prevSlide() {
    if (this.current === 0) return;
    this.last = this.current;
    this.current = this.current - 1;
    this.forward = false;

    this.animateSlide();
  }

  animateSlide() {
    this.isAnimating = true;

    const tl = new TimelineMax({
      paused: true,
      onComplete: () => {
        this.isAnimating = false;
      } });


    const last = this.cache[this.last];
    const lastEl = last.el;
    const lastElems = last.elems;

    const current = this.cache[this.current];
    const currentEl = current.el;
    const currentElems = current.elems;

    const staggerDirection = this.forward ? 0.05 : -0.05;

    tl.
    set(currentEl, {
      autoAlpha: 1 }).

    staggerFromTo(lastElems, 0.75, {
      y: 0,
      alpha: 1 },
    {
      y: this.forward ? -60 : 60,
      alpha: 0,
      ease: Power2.easeIn },
    staggerDirection).
    staggerFromTo(currentElems, 0.75, {
      y: this.forward ? 60 : -60,
      alpha: 0 },
    {
      y: 0,
      alpha: 1,
      ease: Power2.easeOut },
    staggerDirection).
    set(lastEl, {
      autoAlpha: 0 });


    tl.play();

    if (this.current === 1 && this.current > this.last) bgAnimationOne.play();
    if (this.current === 0 && this.current < this.last) bgAnimationOne.reverse();

    this.bulletCache[this.last].classList.remove('is-active');
    this.bulletCache[this.current].classList.add('is-active');
  }

  createBullets() {
    this.bulletCache = [];
    for (let i = 0; i <= this.total; i++) {
      const bullet = document.createElement('div');

      bullet.classList.add('c-slider__bullet', 'js-slider__bullet');
      i === 0 ? bullet.classList.add('is-active') : false;
      this.bulletCache.push(bullet);
      this.pagination.appendChild(bullet);
    }
  }

  addEvents() {
    this.el.addEventListener('wheel', this.changeSlide, false);
  }

  init() {
    this.setCache();
    this.createBullets();
    this.addEvents();
  }}


const slider = new Slider();

const bg = document.querySelector('.js-bg');
const bgAnimationOne = new TimelineMax({ paused: true });
let clipPath = { value: 'circle(30px at 50% 50%)' };

bg.style.clipPath = clipPath.value;

bgAnimationOne.
to(clipPath, 2, {
  value: `circle(${window.innerWidth * 1.25}px at 50% 50%)`,
  onUpdate: () => {
    bg.style.clipPath = clipPath.value;
  },
  ease: Power3.easeInOut });