const addBox=document.querySelector(".add-box"),
popupBox=document.querySelector(".popup-box"),
popupTitle=document.querySelector("header p"),
closeIcon=popupBox.querySelector("header i"),
titleTag=popupBox.querySelector("input"),
descTag=popupBox.querySelector("textarea"),
addBtn=popupBox.querySelector("button");
let greeting=document.querySelector(".greeting h1");
console.log(greeting);



const months=["January","Fabruary","March","April","May","June","July",
"August","September","October","November","December"]

//getting loaclstorage notes if exist and parsing time
//to js object else passing an empty array to notes

const notes=JSON.parse(localStorage.getItem("notes")||"[]");
let isupdate=false,updateId;
addBox.addEventListener("click",()=>
{   titleTag.focus();
    popupBox.classList.add("show");
});
closeIcon.addEventListener("click",()=>
{    isupdate=false;
   titleTag.value="";
    descTag.value="";
    addBtn.innerText="Add Note";
    popupTitle.innerText="Add a new Note";
    popupBox.classList.remove("show");
});


function showNotes()
{ 
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note,index) => {
         let liTag=`<li class="note" draggable="true">
         <div class="details">
           <p>${note.title}</p>
           <span>${note.description}</span>
         </div>
         <div class="buttom-content">
           <span>${note.date}</span>
           <span>${note.time}</span>
           <div class="setting">
             <i onclick="showMenu(this)" class="fa fa-ellipsis-h"></i>
             <ul class="menu">
               <li onclick="updateNote(${index},'${note.title}', '${note.description}')">
                 <i class="fa fa-pencil"></i>Edit
               </li>
               <li onclick="deleteNote(${index})"><i  class="fa fa-trash"></i>Delete</li>
         
             </ul>
           </div>
         </div>
             </li>
         `;
         addBox.insertAdjacentHTML("afterend",liTag);

      
        
    });
}
showNotes();
function showMenu(elem)
{
 elem.parentElement.classList.add("show");
 document.addEventListener("click",e => {
  if(e.target.tagName !="I"|| e.target!=elem)
  {
    elem.parentElement.classList.remove("show");
  }
 })
}
function deleteNote(noteId)
{ let confirmDel=confirm("Are you sure you want to delete this note?");
if(!confirmDel)
{
  return
}
  notes.splice(noteId,1);
  localStorage.setItem("notes",JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId,title,desc)
{
  isupdate=true;
  updateId=noteId;
  addBox.click();
  titleTag.value=title;
    descTag.value=desc;
  addBtn.innerText="Update Note";
  popupTitle.innerText="Update a Note";

  console.log(noteId,title,desc);
}

addBtn.addEventListener("click", e =>{
    e.preventDefault();
    let noteTitle=titleTag.value;
    let  notedesc=descTag.value;
    console.log(noteTitle,notedesc);
    if(noteTitle|| notedesc)
    {    let dateObj=new Date();
        console.log(dateObj);
         let month=months[dateObj.getMonth()],
         day=dateObj.getDate(),
         year=dateObj.getFullYear(),
         houre=dateObj.getHours(),
        minute=dateObj.getMinutes();
         ampm="AM";

         if(houre>=12)
         {
            houre=houre-12;
            ampm="PM"
           

         }
         houre=houre==0?houre=12:houre;
         houre=houre<10?"0"+houre:houre;
         minute=minute<10?"0"+minute:minute;

        
         let noteInfo={
            title:noteTitle,description:notedesc,
            date:`${month} ${day} ${year}`,
            time:`${houre}:${minute} ${ampm}`,
         }
         if(!isupdate)
         { //adding anew note to notes
         notes.push(noteInfo);
        }
        else
        {  isupdate=false;
           notes[updateId]=noteInfo;
        }
        
        //saving notes to localStorage
         localStorage.setItem("notes", JSON.stringify(notes));
         closeIcon.click();
         showNotes();
        
    }
   
})

function addGreeting()
{
  let dateObj=new Date();
  let H=dateObj.getHours();
  if(H>=12)
  {
    H=H-12;
     greeting.innerText="Good Evening ☺️";

  }
  else{
    greeting.innerText="Good Morning ☺️";

  }
    
}
addGreeting()

const container=document.querySelectorAll(".wapper");
document.querySelectorAll(".note").forEach(draggable =>{
  draggable.addEventListener("dragstart",()=>{
    draggable.classList.add("dragging")
  })

  draggable.addEventListener("dragend",()=>{
    draggable.classList.remove("dragging")
  })
 })

 container.forEach(container =>{
  container.addEventListener("dragover", e =>{
     e.preventDefault();
     const afterElement=getDragAfterElement(container,e.clientY);
   
 
    const draggable=document.querySelector('.dragging');
    if(afterElement==null)
    {
        container.appendChild(draggable)
    }
    else
    {
      container.insertBefore(draggable,afterElement)
    }
  

    
  })
 })

 function getDragAfterElement(container,y)
 {
 const draggableElement= [...container.querySelectorAll('.note:not(.dragging)')]
 return draggableElement.reduce((closest,child)=>{
  const box = child.getBoundingClientRect();
  const offset= y - box.top - box.height / 2
  
  if(offset < 0 && offset > closest.offset)
  {
    return { offset:offset,element:child}
  }
  else{
     return closest
  }

 },{offset: Number.NEGATIVE_INFINITY}).element;
 }