// Cohesive target-scene renovation flow for chapters 2-4.
// It intentionally avoids adding loose furniture stickers on top of the scene.
const TARGET_SCENE_NAMES=['暖糖咖啡屋','柠檬暮光露台','奶油梦幻烘焙坊','星灯花园咖啡屋'];
const SCENE_TASK_NAMES=[
  ['焦糖木地板','奶油暖墙与上沿','法式拱窗','蜜桃窗帘','垂吊绿植','暖光吊灯','发光菜单板','咖啡杯展示架','后厨备料柜','弧形服务吧台','意式咖啡机','咖啡豆研磨机','复古收银机','玻璃甜品罩','木质甜品展示架','玻璃甜品柜','粉色花纹地毯','落地盆栽','后排双人卡座','前排双人卡座'],
  ['蜂蜜石材露台地坪','木质入口台阶','弧形玻璃护栏','薄荷柠檬饮品吧','柠檬水分配器','甜品冷藏展示柜','柠檬花顶棚花箱','木质花藤凉棚','暖光串灯','水果服务台','后排藤编双人座','前排藤编双人座','鲜花拍照拱门','甜品开放麦小舞台','麦克风与支架','舞台小灯笼','欢迎黑板','入口花盆组','薄荷色展示柜门板','中央花卉盆栽'],
  ['粉色花边圆地毯','花瓣吊灯','烤炉前操作台','粉砖拱形烤炉','面包冷却架','香料与原料柜','发光食谱菜单板','后方烘焙操作台','拱门内的蛋糕小桌','拱门储物展示架','主蛋糕玻璃展示柜','中央裱花工作岛','薄荷色厨师机','蛋糕装饰转台','礼品包装柜台','礼盒堆叠','前方辅助备料台','试吃圆桌与座椅','粉格桌布','右下角花箱'],
  ['花园石板小径','木质露台地板','悬挂星星灯','薄荷玻璃温室','奶油色茶具柜','玫瑰花藤拱门','中庭喷泉','植物饮品餐车','玻璃茶饮分配器','薄荷茶饮操作台','草莓种植推车','左侧藤编用餐区','右侧藤编用餐区','左侧花纹圆地毯','右侧花纹圆地毯','木桩庭院灯','蓝绣球花盆','左侧弧形花坛','右侧薰衣草花坛','萤火虫地灯串']
];

TARGET_SCENE_NAMES.forEach((name,index)=>{CHAPTERS[index].name=name});
SCENE_TASK_NAMES.forEach((names,chapter)=>names?.forEach((name,index)=>{DECORS[chapter*DECORS_PER_CHAPTER+index][0]=name}));

// Each completed task is a separate transparent sprite placed on the fixed room base.
const SCENE_LAYER_LAYOUTS=[
  [[0,0,0,0],[0,0,0,0],[12,18,25,2],[10,4,22,3],[50,6,18,5],[5,47,16,6],[18,28,14,4],[20,70,17,4],[35,65,17,4],[0,0,0,0],[0,0,0,0],[0,0,0,0],[49,23,15,5],[0,0,0,0],[46,46,16,5],[42,64,22,6],[76,30,19,3],[67,8,17,4],[70,35,23,5],[70,55,23,5]],
  [[7,39,19,3],[43,6,24,6],[16,73,17,4],[65,33,24,5],[26,18,18,4],[9,58,20,4],[52,72,17,5],[35,43,20,6],[19,40,18,4],[67,9,22,5],[53,48,18,5],[72,65,22,5],[8,25,16,4],[31,63,18,4],[60,19,17,4],[76,38,19,3],[45,28,18,5],[74,5,18,4],[52,57,17,4],[75,78,18,4]],
  [[7,41,20,3],[43,7,24,6],[18,72,17,4],[65,35,24,5],[27,18,18,4],[10,59,20,4],[52,72,17,5],[35,43,20,6],[19,41,18,4],[67,9,22,5],[53,48,18,5],[72,65,22,5],[8,25,16,4],[31,63,18,4],[60,19,17,4],[76,38,19,3],[45,28,18,5],[74,5,18,4],[52,57,17,4],[75,78,18,4]],
  [[7,41,20,3],[43,7,24,6],[18,72,17,4],[65,35,24,5],[27,18,18,4],[10,59,20,4],[52,72,17,5],[35,43,20,6],[19,41,18,4],[67,9,22,5],[53,48,18,5],[72,65,22,5],[8,25,16,4],[31,63,18,4],[60,19,17,4],[76,38,19,3],[45,28,18,5],[74,5,18,4],[52,57,17,4],[75,78,18,4]]
];
// Structural upgrades are represented by the room itself; only real furnishings
// receive a sprite. This keeps a café readable instead of turning it into a pile.
const SCENE_ASSET_MAPS=[
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,21,null,23,null,25,null,null,30,31,32,33,34,35,36,37,null,39],
  [null,41,null,43,44,null,46,null,null,null,50,51,52,53,54,null,56,57,null,59],
  [null,null,62,63,64,65,66,67,null,69,70,71,72,73,null,75,null,77,78,null]
];
// Exact cutouts from the approved Warm Sugar Café target illustration.  Each
// task reveals only its own region over the matching empty-room base image.
const WARM_TARGET_CUTS=[
  [{clip:'polygon(0 52%,100% 48%,100% 100%,0 100%)',z:1}],
  [{clip:'polygon(0 0,100% 0,100% 8%,0 8%)',z:2}],
  [],
  [{clip:'polygon(0 7%,11% 7%,11% 39%,0 39%)',z:4},{clip:'polygon(20% 7%,34% 7%,34% 39%,20% 39%)',z:4}],
  [{clip:'polygon(0 14%,17% 14%,17% 37%,0 37%)',z:5}],
  [{clip:'polygon(11% 4%,19% 4%,19% 24%,11% 24%)',z:6},{clip:'polygon(26% 5%,35% 5%,35% 24%,26% 24%)',z:6},{clip:'polygon(40% 6%,49% 6%,49% 24%,40% 24%)',z:6}],
  [{clip:'polygon(46% 11%,62% 11%,62% 26%,46% 26%)',z:5}],
  [{clip:'polygon(34% 24%,61% 24%,61% 35%,34% 35%)',z:5}],
  [{clip:'polygon(40% 35%,64% 35%,64% 50%,40% 50%)',z:4}],
  [{clip:'polygon(0 47%,29% 47%,29% 61%,0 61%)',z:4},{clip:'polygon(29% 53%,58% 53%,58% 62%,29% 62%)',z:4}],
  [{clip:'polygon(5% 27%,34% 27%,34% 49%,5% 49%)',z:7}],
  [{clip:'polygon(29% 28%,40% 28%,40% 44%,29% 44%)',z:8}],
  [{clip:'polygon(24% 40%,45% 40%,45% 52%,24% 52%)',z:9}],
  [{clip:'polygon(36% 42%,50% 42%,50% 53%,36% 53%)',z:10}],
  [{clip:'polygon(77% 17%,100% 17%,100% 41%,77% 41%)',z:5}],
  [{clip:'polygon(63% 39%,100% 39%,100% 61%,63% 61%)',z:7}],
  [{clip:'polygon(0 58%,35% 58%,35% 78%,0 78%)',z:3}],
  [{clip:'polygon(0 72%,18% 72%,18% 96%,0 96%)',z:6}],
  [{clip:'polygon(43% 51%,91% 51%,91% 73%,43% 73%)',z:11}],
  [{clip:'polygon(28% 63%,82% 63%,82% 91%,28% 91%)',z:12}]
];

renderCafe=function(){
  const unlocked=Math.min(CHAPTERS.length-1,Math.floor(state.decor.length/DECORS_PER_CHAPTER));
  state.cafeChapter=Math.min(state.cafeChapter||0,unlocked);
  const c=state.cafeChapter,start=c*DECORS_PER_CHAPTER,end=start+DECORS_PER_CHAPTER;
  const chapter=CHAPTERS[c],scene=$('#cafeScene');
  const ownedCount=state.decor.filter(i=>i>=start&&i<end).length;
  scene.className=`cafe-scene chapter-${c}${ownedCount===DECORS_PER_CHAPTER?' scene-finished':''}`;
  $('#cafeName').textContent=chapter.name;
  $('#chapterNav').innerHTML=CHAPTERS.map((x,i)=>`<button data-chapter="${i}" class="${i===c?'active':''}" ${i>unlocked?'disabled':''}>${i+1}. ${x.name}${i>unlocked?' 🔒':''}</button>`).join('');
  scene.innerHTML=`<div class="scene-title">${chapter.name}</div><div class="scene-progress">🏡 ${ownedCount}/${DECORS_PER_CHAPTER}</div>`;
  DECORS.slice(start,end).forEach((d,j)=>{
    const i=start+j,art=SCENE_ASSET_MAPS[c][j],layout=SCENE_LAYER_LAYOUTS[c][j];
    if(!state.decor.includes(i))return;
    if(c===0){(WARM_TARGET_CUTS[j]||[]).forEach(cut=>{scene.innerHTML+=`<div class="warm-scene-layer" style="--scene-clip:${cut.clip};--scene-z:${cut.z}"></div>`});return}
    if(art!==null&&layout[2])scene.innerHTML+=`<div class="decor" style="--decor-top:${layout[0]}%;--decor-left:${layout[1]}%;--decor-width:${layout[2]}%;--decor-z:${layout[3]}"><img src="assets/decor/decor-${art}.png" alt="${d[0]}"></div>`;
  });
  $('#decorList').innerHTML=DECORS.slice(start,end).map((d,j)=>{
    const i=start+j,art=SCENE_ASSET_MAPS[c][j],owned=state.decor.includes(i),ok=state.stars>=d[2]&&state.coins>=d[3];
    const status=owned?'已融入目标场景':`⭐${d[2]}　🪙${d[3]} · +${DECOR_XP} XP 和基础机器`;
    const thumbnail=art===null?`<span class="decor-task-number">${j+1}</span>`:`<img src="assets/decor/decor-${art}.png" alt="${d[0]}">`;
    return `<div class="decor-card ${owned?'owned':''}">${thumbnail}<div><b>${d[0]}</b><small>${status}</small></div><button ${owned||!ok?'disabled':''} data-decor="${i}">${owned?'完成':'装修'}</button></div>`;
  }).join('');
  document.querySelectorAll('[data-decor]').forEach(b=>b.onclick=()=>buyDecor(+b.dataset.decor));
  document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{state.cafeChapter=+b.dataset.chapter;render()});
};

render();
