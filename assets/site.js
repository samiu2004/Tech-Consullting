(function initCanvas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    var count = Math.min(80, Math.floor(w / 20));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 180, 216, ' + (0.20 * (1 - dist / 130)) + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 230, 118, 0.65)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', function() {
    resize();
    createParticles();
  });
})();
const toggle=document.querySelector('.nav-toggle');const links=document.querySelector('.nav-links');toggle?.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open')){links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
const search=document.querySelector('#tool-search'),category=document.querySelector('#tool-category');function filterTools(){let count=0;document.querySelectorAll('.tool').forEach(el=>{const visible=el.textContent.toLowerCase().includes(search.value.toLowerCase().trim())&&(category.value==='all'||el.dataset.category===category.value);el.hidden=!visible;if(visible)count++;});document.querySelector('#tool-count').textContent=count+' tools shown';document.querySelector('#tool-empty').hidden=count>0;}if(search){search.addEventListener('input',filterTools);category.addEventListener('change',filterTools);filterTools();}
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.block').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
