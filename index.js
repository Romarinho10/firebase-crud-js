const db = firebase.firestore();

const taskForm =  document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

let editStatus = false;
let id = '';


const saveTask = (title, description) => {

    db.collection('task').doc().set({ //crear db
        title,  //title: title
        description
    });

}

const getTasks = () => db.collection('task').get(); //conectar a db

const getTask = (id) => db.collection('task').doc(id).get(); //obtener dato desde una id especifica

const onGetTask = (callback) => db.collection('task').onSnapshot(callback); 

const deleteTask = id => db.collection('task').doc(id).delete(); //eliminar

const updateTask = (id, updatedTask) => db.collection('task').doc(id).update(updatedTask);

 
//agregando evento en la ventana
window.addEventListener('DOMContentLoaded', async (e) =>{
    //const querySnapshot = await getTasks();
    onGetTask((querySnapshot) => {
        taskContainer.innerHTML =''; //para no duplicar datos cuando se refresque la pag
        querySnapshot.forEach( doc => {
            //console.log(doc.data()) //devuelve los datos de cada documento
    
            const task = doc.data();
            task.id=doc.id; //get id from db
    
            taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
            <h3 class="h5">${task.title}</h3>
            <p>${task.description}</p>
            <div>
            <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
            <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button> 
            </div>
    
            </div>`;

            const btnsDelete = document.querySelectorAll('.btn-delete');
            //console.log(btnsDelete);
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    //console.log(e.target.dataset.id);
                   await deleteTask(e.target.dataset.id);
                })
            });

            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    //console.log(e.target.dataset.id);
                    const doc = await getTask((e.target.dataset.id));
                    //console.log(doc.data()); //mostrar datos
                    const tarea = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskForm['task-title'].value = tarea.title
                    taskForm['task-description'].value = tarea.description
                    taskForm['btn-task-form'].innerText = 'Update';
                });
            });

    
        });
    })
    
})

//btn save
taskForm.addEventListener('submit', async (e) =>{
    e.preventDefault();

    
    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    if(!editStatus) {
        await saveTask(title.value, description.value); //caputar el valor de los campos title y description
    } else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        });

        editStatus = false;
        id = '';
        taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    title.focus();

 // console.log(title, description);
});