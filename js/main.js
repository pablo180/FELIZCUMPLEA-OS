(function(){
    const c = document.getElementById('fw'); const ctx = c.getContext('2d'); let w,h,dpr;
    function resize(){
        dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        w = c.width = Math.floor(innerWidth * dpr); h = c.height = Math.floor(innerHeight * dpr);
        c.style.width = '100vw'; c.style.height = '100vh';
    }
    addEventListener('resize', resize, {passive:true}); resize();

    const gravity=0.035, friction=0.985; const rockets=[], particles=[];
    function rnd(a,b){return Math.random()*(b-a)+a}
    function hsla(h,s,l,a){return `hsla(${h},${s}%,${l}%,${a})`}

    function launchToCenter(){
        const x0 = rnd(w*0.1, w*0.9), y0 = h;
        const tx = rnd(w*0.2, w*0.8), ty = rnd(h*0.1, h*0.4);
        const ang = Math.atan2(ty-y0, tx-x0); const sp = rnd(10,14);
        rockets.push({x:x0,y:y0,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,color:Math.floor(rnd(0,360)),targetY:ty});
    }

    function explode(x,y,hue){
        const n = 350;
        for(let i=0;i<n;i++){
            const ang=(i/n)*Math.PI*2 + rnd(-0.05,0.05); const sp=rnd(2,9);
            particles.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:rnd(1.2, 1.8),color:hue+rnd(-20,20)});
        }
    }

    function step(){
        ctx.globalCompositeOperation='destination-out'; ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(0,0,w,h);
        ctx.globalCompositeOperation='lighter';
        for(let i=rockets.length-1;i>=0;i--){
            const r=rockets[i]; r.vy+=gravity; r.x+=r.vx; r.y+=r.vy;
            ctx.beginPath(); ctx.arc(r.x,r.y,2.6*dpr,0,Math.PI*2); ctx.fillStyle=hsla(r.color,100,60,1); ctx.fill();
            ctx.beginPath(); ctx.moveTo(r.x,r.y); ctx.lineTo(r.x-r.vx*3, r.y-r.vy*3); ctx.strokeStyle=hsla(r.color,100,60,0.75); ctx.lineWidth=2*dpr; ctx.stroke();
            if(r.y<=r.targetY || r.vy >= 0){ explode(r.x,r.y,r.color); rockets.splice(i,1); }
        }
        for(let i=particles.length-1;i>=0;i--){
            const p=particles[i]; p.vx*=friction; p.vy=p.vy*friction+gravity*0.5; p.x+=p.vx; p.y+=p.vy; p.life-=0.01;
            if(p.life<=0){particles.splice(i,1); continue}
            ctx.beginPath(); ctx.arc(p.x,p.y,2.5*dpr*(p.life/1.5),0,Math.PI*2); ctx.fillStyle=hsla(p.color,100,70,Math.max(p.life,0)); ctx.fill();
        }
        requestAnimationFrame(step);
    }
    step();
    function burst(){ launchToCenter(); setTimeout(launchToCenter,150); setTimeout(launchToCenter,350); setTimeout(launchToCenter,600); }
    c.addEventListener('click', burst); c.addEventListener('touchstart', ()=> burst(), {passive:true});
    setTimeout(burst, 800);
})();
