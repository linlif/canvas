// 开始时间
// var BEGIN_DATE = '2019-08-01 20:13:14'


// 入口js文件
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 500;
var RADIUS = 8;
var MARGIN_LEFT = 5;
var MARGIN_TOP = 5;

// var endTime = new Date(2017,7,3,23,23,50); // 月份要-1，时间必须在未来的3天,因为最多可以显示为99:59:59。
// endTime.setTime(endTime.getTime() + 10 * 3600 * 1000);

var curShowTimeSeconds = 0;

// var ball = {x: 2, y: 3, r:20, vx: 3, vy: 3, g: 2, color:"#005588"};
var balls = [];

const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];


window.onload = function () {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  WINDOW_WIDTH = document.body.clientWidth || document.documentElement.clientWidth;
  WINDOW_HEIGHT = document.body.clientHeight * 0.8 || document.documentElement.clientHeight * 0.8;

  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;

  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 10);

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  curShowTimeSeconds = getCurrentShowTimeSeconds();

  // 每次刷新重新获取当前日期
  currentDate();

  setInterval(
    function () {
      render(context);
      update();
    },
    50
  );

};


// 获取倒计时
function getCurrentShowTimeSeconds() {
  var curTime = new Date();

  // ret = endTime.getTime()-curTime.getTime();
  // ret = Math.round(ret / 1000);

  ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

  // return ret >= 0 ? ret : 0;
  return ret;
}

// 更新函数
function update() {
  var nextShowTimeSeconds = getCurrentShowTimeSeconds();
  var nextHours = parseInt(nextShowTimeSeconds / 3600);
  var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
  var nextSeconds = nextShowTimeSeconds % 60;

  var curHours = parseInt(curShowTimeSeconds / 3600);
  var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
  var curSeconds = curShowTimeSeconds % 60;

  // 判断当前时间与下一个要显示的时间是否相同，不同就将当前时间设置为下一个要显示的时间
  if (nextSeconds !== curSeconds) {
    // 对时、分、秒进行对比，一旦改变则生成当前时间的小球
    if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
      addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
    }
    if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
      addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours / 10));
    }


    if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
      addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
    }
    if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
      addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
    }


    if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
      addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
    }
    if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
      addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
    }

    // 定时更新日期
    if (curHours === 23 && curMinutes === 59 && curSeconds === 59) {
      currentDate();
    }

    // 将要显示的时间设置为当前时间，达到显示的效果
    curShowTimeSeconds = nextShowTimeSeconds;

  }
  // 更新小球，产生小球动画
  updateBalls();

}

// 计算两个日期的差值(d2-d1)，返回天数
function getDays(d1, d2) {
  var time = +new Date(d2) - +new Date(d1)
  var days = Math.floor(time / 1000 / 60 / 60 / 24)
  return days
}


// 获取两个日期的差值(d2-d1)，返回年月日
function getYMD(d1, d2) {
  var d1 = new Date(d1)
  var d2 = new Date(d2)
  var years = d2.getFullYear() - d1.getFullYear()
  var months = d2.getMonth() - d1.getMonth()
  var days = d2.getDate() - d1.getDate()

  return { years, months, days }
}

// 更新日期
function currentDate() {
  var date = document.getElementById("date");
  var footer = document.getElementById("footer");


  var beginDate = new Date(2019, 07, 01, 20, 13, 14); // 2019-08-01 22:13:14 ，月份要减一
  var curDate = new Date();

  var y = curDate.getFullYear();
  var m = curDate.getMonth() + 1;
  var d = curDate.getDate();

  var y2 = beginDate.getFullYear();
  var m2 = beginDate.getMonth() + 1;
  var d2 = beginDate.getDate();
  var hour = beginDate.getHours() < 10 ? '0' + beginDate.getHours() : beginDate.getHours();
  var minute = beginDate.getMinutes() < 10 ? '0' + beginDate.getMinutes() : beginDate.getMinutes();
  var second = beginDate.getSeconds() < 10 ? '0' + beginDate.getSeconds() : beginDate.getSeconds();

  var days = getDays(beginDate, curDate)
  var ymd = getYMD(beginDate, curDate)

  date.innerHTML = days + '天' + '(' + ymd.years + ' 年 ' + ymd.months + ' 月 ' + ymd.days + ' 日)'
  footer.innerHTML = y2 + ' 年 ' + m2 + ' 月 ' + d2 + ' 日 ' + hour + ':' + minute + ':' + second + ' 至 ' + y + ' 年 ' + m + ' 月 ' + d + ' 日'
}

// 生成小球
function addBalls(x, y, num) {
  for (var i = 0; i < digit[num].length; i++) {
    for (var j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        var aBall = {
          x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          g: 1.5 + Math.random(),
          // 产生-4 ~ +4的随机x轴速度
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
          vy: -5,
          color: colors[Math.floor(Math.random() * colors.length)]
        };

        balls.push(aBall);
      }
    }
  }
}

// 更新小球
function updateBalls() {
  for (var i = 0; i < balls.length; i++) {
    // 改变小球的速度
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;

    // 碰撞检测，当小球的边缘接触到画布边缘时，速度取反，速度（由于摩擦）变慢
    if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
      balls[i].y = WINDOW_HEIGHT - RADIUS;
      balls[i].vy = -balls[i].vy * 0.75; // 摩擦系数
    }
  }

  var count = 0;
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].x + RADIUS > 0 && balls[j].x - RADIUS < WINDOW_WIDTH) {
      balls[count++] = balls[j];
    }
  }
  while (balls.length > Math.min(300, count)) {
    // console.log('balls > 300 ', balls.length)
    balls.pop();
  }

}


function render(context) {
  // 清除矩形达到刷新效果，这里清除整个画布这个矩形
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  var hours = parseInt(curShowTimeSeconds / 3600);
  var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
  var seconds = curShowTimeSeconds % 60;
  // 绘制时钟
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
  renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), context);
  renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, context);
  renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), context);
  renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), context);
  renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, context);
  renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), context);
  renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), context);

  // 绘制小球
  for (var i = 0; i < balls.length; i++) {
    //设置颜色
    context.fillStyle = balls[i].color;
    // 开始绘制
    context.beginPath();
    context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
    context.closePath();
    // 填充颜色
    context.fill();
  }

}

function renderDigit(x, y, num, context) {
  // 设置填充颜色
  context.fillStyle = "rgb(0,102,153)";
  // 遍历二维数组
  for (var i = 0; i < digit[num].length; i++) {
    for (var j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        context.beginPath();
        context.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
      }
    }
  }
}