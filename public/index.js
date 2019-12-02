let mouse = {
  click: false,
  move: false,
  pos: { x: 0, y: 0},
  pos_prev: false,
  lineWidth: 2
};

// Canvas
let canvas = document.getElementById('drawing');
let context = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;

function init() {
  
   
  // Socket IO
  let socket = io();

  // Set the canvas width and height to the browser size       
  canvas.width = width;
  canvas.height = height;
  console.log(canvas.height);
  console.log(width);
  

  canvas.addEventListener('mousedown', (e) => {
    mouse.click = true;
    console.log(mouse.click);
  });

  canvas.addEventListener('mouseup', (e) => {
    mouse.click = false;
  });

  canvas.addEventListener('mousemove', e => {
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / canvas.height;
    mouse.move = true;
  });

  socket.on('draw_line', data => {
    let line = data.line;
    context.beginPath();
    context.lineWidth = mouse.lineWidth;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });

  function mainLoop() {
    if(mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
      mouse.move = false;
    }
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25);
  }

  mainLoop();
}

function aumenta(){
  mouse.lineWidth = mouse.lineWidth * 1.4;
  console.log('aumentado!')
}

function decrementa(){
  mouse.lineWidth = mouse.lineWidth * 0.6;
  console.log('decrementado!')
}

function limpiar(){
  context.clearRect(0,0, canvas.width, canvas.height);
  context.strokeStyle = '#000'
  mouse.lineWidth = 2;
}

document.addEventListener('DOMContentLoaded', init);

function cambiarColor(e){
  switch(e.id){
    case 'verde': context.strokeStyle = '#0F0';
    break;
    case 'azul': context.strokeStyle = '#00F';
    break;
    case 'rojo': context.strokeStyle = '#F00';
    break;
    case 'naranja': context.strokeStyle = '#FF8000';
    break;
    case 'negro': context.strokeStyle = '#000';
    break;
  }
}

function borrador(e){
  context.strokeStyle = '#FFF'
  mouse.lineWidth = 15;
}

function pincel(e){
  context.strokeStyle = '#000'
  mouse.lineWidth = 2;
}