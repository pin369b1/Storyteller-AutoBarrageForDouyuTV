let div1 = document.createElement('div');//默认悬浮窗
let div2 = document.createElement('div');//控制台
let css1 = 'background: #1A59B7;color:#ffffff;overflow: hidden;z-index: 998;position: fixed;padding:5px;text-align:center;width: 75px;height: 22px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;right: 10px;top: 30%;'
let css2 = 'background: #E5E4E4;color:#ffffff;overflow: hidden;z-index: 999;position: fixed;padding:5px;text-align:center;width: 150px;height: 275px;border-color: #FFFFFF;border: 3px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;right: 10px;top: 30%;display: none;';
let max_danmu_long = 43;//弹幕字数限制
const min_danmu_long = 20;//最小弹幕长度
const error_danmu_long = 30;//防止无法断句弹幕长度
let cycle_time;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 过低有系统屏蔽风险
let story;//textarea内容
let story_arr = [];//story分段
let index = 0;//小说分段
let interval;//定时器

init();//初始化

//核心功能函数
function init() {
    div1.id = 'DuLunChe';
    div1.id = 'DuLunChe1';
    div1.style.cssText = css1;
    div2.style.cssText = css2;
    div1.innerHTML = '独轮车控制台';
    div2.innerHTML = '<select id="DuLunCheSelect"><option value="0">单句模式</option><option value="1">说书模式</option></select><textarea id="DuLunCheText" rows="10" cols="20" placeholder="输入内容"></textarea><div  style="margin: 0 auto;"><input type="text" placeholder="间隔时间(ms) 建议六千以上" id="DuLunCheTime"/><button id="DuLunCheBtn" style="background-color: #FFFFFF;">出动！</button><br><button id="DuLunCheYincang" style="background-color: #FFFFFF;">隐藏控制台</button></div>';
    div1.onclick = () => {div2.style.setProperty('display','block');}
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    document.getElementById('DuLunCheYincang').onclick = () => {div2.style.setProperty('display','none');}
    document.getElementById('DuLunCheBtn').onclick = () => {
        if(document.getElementById('DuLunCheBtn').innerText === '出动！') run();
        else finish();
    }
    alert('欢迎使用说书人自动弹幕发射装置，本插件由斗鱼用户重载操作符和祖冲之丶丶基于祖冲之丶丶V1.5控制台版制作，项目地址：https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV/ 为了自己的账号和他人观看体验，建议发言间隔调至8000以上，喜欢的好兄弟打个星星吧~求求了！！！');
}
function run() {
    let btn = document.getElementsByClassName('ChatSend-button')[0];
    let txt = document.getElementsByClassName('ChatSend-txt')[0];
    document.getElementById('DuLunCheBtn').innerText = '中止';
    story = document.getElementById('DuLunCheText').value;
    cycle_time = parseInt(document.getElementById('DuLunCheTime').value);
    if(!story.length || !cycle_time){
        alert('请勿空置运行！')
        finish();
        return;
    }else if(cycle_time <= 2999) {
        alert('请珍惜账号 加大发言间隔！')
        finish();
        document.getElementById('DuLunCheTime').value = '9999'
        return;
    }
    if(document.getElementById('DuLunCheSelect').value === '0') {
        if (story.length > 43){
            story = story.slice(0,44);
        }
        interval = setInterval(() => {
            txt.value = story;
            if (btn.innerHTML === '发送') {
                btn.click();
            }
        }, cycle_time);
    }else {
        get_better_sentence();
        let len = story_arr.length;
        interval = setInterval(() => {
            if(index === len){//小说循环
                index = 0;
            }
            txt.value = story_arr[index++];
            if (btn.innerHTML === '发送') {
                btn.click();
            }
        }, cycle_time);
    }
}
function finish() {
    document.getElementById('DuLunCheBtn').innerText = '出动！';
    clearInterval(interval);
}
function get_better_sentence() {
    let len = story.length;
    let st = 0;
    let flag = 0;//引号标记
    for (let i = 0; i < len; i++) {
        if((story.charAt(i) === '。' || story.charAt(i) === '！' || story.charAt(i) === '？' || story.charAt(i) === '…') && i - st + 1 >= min_danmu_long && !flag) {
            story_arr.push(story.slice(st,i + 1));
            st = i + 1;
        }else if(story.charAt(i) === '“') {
            flag = 1;
        }else if(story.charAt(i) === '”') {
            flag = 0;
        }else if((story.charAt(i) === '，' || story.charAt(i) === '；' || story.charAt(i) === '：' || story.charAt(i) === '。' || story.charAt(i) === '！' || story.charAt(i) === '？' || story.charAt(i) === '…') && i - st + 1 >= error_danmu_long) {
            story_arr.push(story.slice(st,i + 1));
            st = i + 1;
        }else if(i - st + 1 >= max_danmu_long) {
            story_arr.push(story.slice(st,i + 1));
            st = i + 1;
        }
    }
}