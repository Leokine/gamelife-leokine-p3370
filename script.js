var Rows=10; //ВЫСОТА ПОЛЯ
var Cols=10; //ШИРИНА ПОЛЯ

var cells;
var field;

var tickTime=4;

var stop=1;


function newArray()
{
  field=[]; //создаем и заполняем двумерный числовой массив для поля

  for(var r=0; r<Rows; r++)
    field.push([]);//добавляем элементы

  for(var r=0; r<Rows; r++)
    for(var c=0; c<Cols; c++)
      field[r][c]=0;
  
  cells=[]; //создаем массив для блочных эл-в
  for(var i=0; i<Rows; i++)
    cells.push([]);
}

function fillField() //заполняем поле мертвыми клетками
{
  var F=document.getElementById("game"); //получаем игровое поле со страницы
  
  while(F.firstChild) //пока есть потомки
    F.removeChild(F.firstChild);//очистить их
  
  newArray();//вызов функции для создания элементов на поле
  for(var x=0; x<Rows; x++) //____для каждой строки
  {  
    var R=document.createElement("div"); //создаем ряд для клеток
    R.setAttribute("class","row"); //присваиваем класс
    F.appendChild(R); //добавляем на поле
    
		for(var y=0;y<Cols;y++) //____для каждой клетки в строке
    {
      var cell=document.createElement("div"); // создаем блок
      cell.style.height=50+"px";//размеры клетки
      cell.style.width=50+"px";
      
      cell.x=x; //координаты
      cell.y=y;
      cell.alive=false; //неживое состояние
      cell.timer=0; //счетчик времени, сколько мышь на клетке
      cell.setAttribute("class","cell"); //присваиваем класс
      
      cell.onclick=function() //нажатие на клетку
      {
        this.alive=!this.alive; //изменить состояние на противоположное
        this.style.background=this.alive?"grey":"white"; //изменить цвет
        field[this.x][this.y]=this.alive?1:0; //в зависимости от состояния, записать в массив 1 или 0
        empty=0;
      }
      
      cell.onmouseover=function() //обработка наведения мыши
      {
        if(!this.alive||stop==1) //если мертвая клетка - ничего
          return;

        this.timer=setTimeout(killCell,tickTime*100,this); //таймер при наведении
      }      

      cell.onmouseout=function() //если убрали мышь
      {
        if(this.timer!=0) //и если таймер был запущен
        {
          clearTimeout(this.timer); //остановить смерть
          this.timer=0; //обнулить таймер
        }
      } 
      
      R.appendChild(cell); //заносим клетку в строку
      cells[x][y]=cell; //и в массив
		}    
	}
}

function updateField()
{
	for(var x=0;x<Rows;x++)
		for(var y=0;y<Cols;y++)
      cells[x][y].style.background=field[x][y]==1?"gray":"white";
}

fillField();

function killCell(c) //убить клетку
{
  c.alive=false;
  c.style.background="gray"; 
  field[c.x][c.y]=0;
}
  


function neighbors(r,c) //подсчет соседей 
{
  var cnt=0; //счетчик

  if(r>=1&c>=1) 
    cnt+=field[r-1][c-1];
  if(r>=1) 
    cnt+=field[r-1][c];
  if(r>=1&c<Cols-1) 
    cnt+=field[r-1][c+1];

  if(c>=1) 
    cnt+=field[r][c-1];
  if(c<Cols-1) 
    cnt+=field[r][c+1];

  if(r<Rows-1&c>=1) 
    cnt+=field[r+1][c-1];
  if(r<Rows-1) 
    cnt+=field[r+1][c];
  if(r<Rows-1&c<Cols-1) 
    cnt+=field[r+1][c+1];

  return cnt; 
}

function tick() //обработка одного тика
{

  var newField=[]; //новый массив для поля
  for(var r=0;r<Rows;r++)
    newField.push([]);

  for(var r=0;r<Rows;r++)
    for(var c=0;c<Cols;c++)
      newField[r][c]=0;

  var cellSum=0;
  for(var r=0;r<Rows;r++) //проходим по новому полю и расставляем обновляем клетки
    for(var c=0;c<Cols;c++)
    {
      var cnt=neighbors(r,c) //считаем соседей у клетки в прошлый тайм

      if(field[r][c]==0) 
      {
        if(cnt==3) //если хватало соседей
            newField[r][c]=1; //оживляем ее
      }
      else //если клетка была жива
      {
        if(cnt<2||cnt>3) //Если у клетки не 2 или 3 живых соседа, то она умирает
          newField[r][c]=0;
        else
          newField[r][c] = true; //иначе, все нормально
      }
      cellSum+=field[r][c];
    }

  field=newField; //обновляем поле
  updateField(); //рисуем поле по значениям из массива

  if(cellSum==0)
  {
    empty=1;
    stop=1;
    document.getElementById("b").textContent="PLAY";
  }

  if(stop==0)
    setTimeout(tick,tickTime*250) //новый тик
}

function run()
{
  if(stop==1)
  {
    document.getElementById("b").textContent="PAUSE";
    stop=0;
    tick();
  }  
  else
  {
    document.getElementById("b").textContent="PLAY";
    stop=1;
  }
}

function changeTick(x)
{
  tickTime=x;
  document.getElementById("timer").textContent=x/4+'s';
}

function clr()
{
  document.getElementById("b").textContent="PLAY";
  stop=1;
  for(var r=0; r<Rows; r++)
    for(var c=0; c<Cols; c++)
      field[r][c]=0;//заносим 0 в массив
  updateField();
}