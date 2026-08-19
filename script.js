// LUNARC 2.0 — Main Script

// ---------- Splash Screen ----------
function initializeSite() {
    const btn = document.getElementById('init-btn');
    btn.textContent = '⚡ INITIALIZING...';
    btn.disabled = true;
    setTimeout(() => {
        const splash = document.getElementById('splash');
        const main = document.getElementById('main-site');
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
            main.classList.remove('hidden');
            document.body.style.overflow = 'auto';
            initReveal();
            initShader();
            initCountdown();
        }, 800);
    }, 600);
}

// ---------- Three.js Shader Animation ----------
function initShader() {
    const container = document.getElementById('shader-canvas');
    if (!container || !window.THREE) return;
    const THREE = window.THREE;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    const uniforms = {
        time: { type: 'f', value: 1.0 },
        resolution: { type: 'v2', value: new THREE.Vector2() }
    };

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
        fragmentShader: `
            #define TWO_PI 6.2831853072
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            float random(in float x){return fract(sin(x)*1e4);}
            float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
            void main(void){
                vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
                vec2 fMosaicScal=vec2(4.0,2.0);
                vec2 vScreenSize=vec2(256.0,256.0);
                uv.x=floor(uv.x*vScreenSize.x/fMosaicScal.x)/(vScreenSize.x/fMosaicScal.x);
                uv.y=floor(uv.y*vScreenSize.y/fMosaicScal.y)/(vScreenSize.y/fMosaicScal.y);
                float t=time*0.06+random(uv.x)*0.4;
                float lineWidth=0.0008;
                vec3 color=vec3(0.0);
                for(int j=0;j<3;j++){
                    for(int i=0;i<5;i++){
                        color[j]+=lineWidth*float(i*i)/abs(fract(t-0.01*float(j)+float(i)*0.01)*1.0-length(uv));
                    }
                }
                gl_FragColor=vec4(color[2],color[1],color[0],1.0);
            }
        `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const resize = () => {
        const rect = container.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        uniforms.resolution.value.x = renderer.domElement.width;
        uniforms.resolution.value.y = renderer.domElement.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
        requestAnimationFrame(animate);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
    };
    animate();
}

// ---------- Scroll Reveal ----------
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
}

// ---------- Navbar scroll ----------
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    nav.style.background = window.scrollY > 60 ? 'rgba(2,4,10,0.95)' : 'rgba(2,4,10,0.8)';
    nav.style.boxShadow = window.scrollY > 60 ? '0 4px 30px rgba(0,0,0,0.6)' : 'none';
});

document.addEventListener('DOMContentLoaded', () => { 
    document.body.style.overflow = 'hidden'; 
    initCountdown();
});

// ---------- Early Bird Countdown Timer ----------
function initCountdown() {
    // Early Bird deadline: August 23, 2026 23:59:59 (Month index 7 = August)
    const targetDate = new Date(2026, 7, 23, 23, 59, 59).getTime();
    
    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;
        
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');
        const timerContainer = document.getElementById('earlybird-timer');
        
        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;
        
        if (isNaN(diff) || diff <= 0) {
            if (timerContainer) {
                timerContainer.innerHTML = '<span style="color:#ef4444;font-weight:700;font-size:1.1rem">🔥 EARLY BIRD EXPIRED — REGULAR PRICING (₹110) APPLIES</span>';
            }
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}
