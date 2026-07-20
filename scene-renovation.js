// Cohesive target-scene renovation flow for chapters 2-4.
// It intentionally avoids adding loose furniture stickers on top of the scene.
const TARGET_SCENE_NAMES=['暖糖咖啡屋','柠檬暮光露台','奶油梦幻烘焙坊','星灯花园咖啡屋'];
const SCENE_TASK_NAMES=[
  null,
  ['蜂蜜石材露台地坪','木质入口台阶','弧形玻璃护栏','薄荷柠檬饮品吧','柠檬水分配器','甜品冷藏展示柜','柠檬花顶棚花箱','木质花藤凉棚','暖光串灯','水果服务台','后排藤编双人座','前排藤编双人座','鲜花拍照拱门','甜品开放麦小舞台','麦克风与支架','舞台小灯笼','欢迎黑板','入口花盆组','薄荷色展示柜门板','中央花卉盆栽'],
  ['粉色花边圆地毯','花瓣吊灯','烤炉前操作台','粉砖拱形烤炉','面包冷却架','香料与原料柜','发光食谱菜单板','后方烘焙操作台','拱门内的蛋糕小桌','拱门储物展示架','主蛋糕玻璃展示柜','中央裱花工作岛','薄荷色厨师机','蛋糕装饰转台','礼品包装柜台','礼盒堆叠','前方辅助备料台','试吃圆桌与座椅','粉格桌布','右下角花箱'],
  ['花园石板小径','木质露台地板','悬挂星星灯','薄荷玻璃温室','奶油色茶具柜','玫瑰花藤拱门','中庭喷泉','植物饮品餐车','玻璃茶饮分配器','薄荷茶饮操作台','草莓种植推车','左侧藤编用餐区','右侧藤编用餐区','左侧花纹圆地毯','右侧花纹圆地毯','木桩庭院灯','蓝绣球花盆','左侧弧形花坛','右侧薰衣草花坛','萤火虫地灯串']
];

TARGET_SCENE_NAMES.forEach((name,index)=>{CHAPTERS[index].name=name});
SCENE_TASK_NAMES.forEach((names,chapter)=>names?.forEach((name,index)=>{DECORS[chapter*DECORS_PER_CHAPTER+index][0]=name}));

renderCafe=function(){
  const unlocked=Math.min(CHAPTERS.length-1,Math.floor(state.decor.length/DECORS_PER_CHAPTER));
  state.cafeChapter=Math.min(state.cafeChapter||0,unlocked);
  const c=state.cafeChapter,start=c*DECORS_PER_CHAPTER,end=start+DECORS_PER_CHAPTER;
  const chapter=CHAPTERS[c],scene=$('#cafeScene');
  const ownedCount=state.decor.filter(i=>i>=start&&i<end).length,composition=SCENE_COMPOSITIONS[c];
  scene.className=`cafe-scene chapter-${c}${ownedCount===DECORS_PER_CHAPTER?' scene-finished':''}`;
  $('#cafeName').textContent=chapter.name;
  $('#chapterNav').innerHTML=CHAPTERS.map((x,i)=>`<button data-chapter="${i}" class="${i===c?'active':''}" ${i>unlocked?'disabled':''}>${i+1}. ${x.name}${i>unlocked?' 🔒':''}</button>`).join('');
  scene.innerHTML=`<div class="scene-title">${chapter.name}</div><div class="scene-counter"><span>${['今日甜点','露台限定','新鲜出炉','花园特饮'][c]} · ${ownedCount}/${DECORS_PER_CHAPTER}</span></div>`;
  if(c>0)scene.insertAdjacentHTML('beforeend',`<div class="scene-renovation-mask" style="--mask-opacity:${Math.max(.06,.72-ownedCount/DECORS_PER_CHAPTER*.66)}"></div><div class="scene-progress">🏡 ${ownedCount}/${DECORS_PER_CHAPTER}</div>`);
  DECORS.slice(start,end).forEach((d,j)=>{
    const i=start+j,art=d[4],layout=composition[j];
    if(c===0&&state.decor.includes(i)&&layout)scene.innerHTML+=`<div class="decor" style="--decor-top:${layout[0]}%;--decor-left:${layout[1]}%;--decor-width:${layout[2]}%;--decor-z:${layout[3]}"><img src="assets/decor/decor-${art}.png" alt="${d[0]}"></div>`;
  });
  $('#decorList').innerHTML=DECORS.slice(start,end).map((d,j)=>{
    const i=start+j,art=d[4],owned=state.decor.includes(i),ok=state.stars>=d[2]&&state.coins>=d[3];
    const status=owned?(c>0?'已融入目标场景':'已布置到场景'):`⭐${d[2]}　🪙${d[3]} · +${DECOR_XP} XP 和基础机器`;
    const thumbnail=c>0?`<span class="decor-task-number">${j+1}</span>`:`<img src="assets/decor/decor-${art}.png" alt="${d[0]}">`;
    return `<div class="decor-card ${owned?'owned':''}">${thumbnail}<div><b>${d[0]}</b><small>${status}</small></div><button ${owned||!ok?'disabled':''} data-decor="${i}">${owned?'完成':'装修'}</button></div>`;
  }).join('');
  document.querySelectorAll('[data-decor]').forEach(b=>b.onclick=()=>buyDecor(+b.dataset.decor));
  document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{state.cafeChapter=+b.dataset.chapter;render()});
};

render();
