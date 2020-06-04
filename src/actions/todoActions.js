import axios from "axios";
import {
  GET_TODOS,
  ADD_TODO,
  DELETE_TODO,
  UPDATE_TODO,
  FILTER_TODO,
  TODOS_LOADING
} from "./types.js";

export const getTodos = () => dispatch => {
  dispatch(setTodosLoading());
  /*const todos = JSON.parse(localStorage.getItem("todos")) || [];
  if (todos.length) {
    dispatch({
      type: GET_TODOS,
      payload: todos
    });
  } else {*/
    axios.get("https://todohack.herokuapp.com/myposts",
    {
        headers: {
            "auth":localStorage.getItem("Token")
        },
    }
  ).then(res =>{
    //console.log(res.data,'see');
      return dispatch({
        type: GET_TODOS,
        payload: res.data
      });

    });
  //}
};

export const addTodo = todo => dispatch => {
  const todos =JSON.parse( localStorage.getItem("todos") )|| [];
  todos.unshift(todo);
  const {name,category,tags,completed,description,date,dueDate}=todo;
  const data={
    name,category,tags,completed,description,date,dueDate
  }
  axios.post('https://todohack.herokuapp.com/post',data,
  {
      headers: {
          "auth":localStorage.getItem("Token")
      },
  }
)
   .then(data=>{
     //console.log(data);
   })
   .catch(err=>{
     console.log(err);
   });


  localStorage.setItem("todos", JSON.stringify(todos));
  dispatch({
    type: ADD_TODO,
    payload: todo
  });
};

export const deleteTodo = id => dispatch => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const newTodos = todos.filter(todo => {
    return todo._id !== id;
  });

  localStorage.setItem("todos", JSON.stringify(newTodos));

  axios.put('https://todohack.herokuapp.com/deletepost',{postId:id})
   .then(data=>{
     //console.log(data);
   })
   .catch(err=>{
     console.log(err);
   });
  dispatch({
    type: DELETE_TODO,
    payload: id
  });
};

export const updateTodo = updatedTodo => dispatch => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  //console.log(updateTodo.name);
  //console.log('herrr',updatedTodo);
  const updatedTodos = todos.map( (todo, index) => {
    if (todo._id === updatedTodo._id) {
      return (todo = updatedTodo);
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
  console.log(updatedTodo,'kill');
  axios.put('https://todohack.herokuapp.com/updatepost',updatedTodo,
  {
      headers: {
          "auth":localStorage.getItem("Token")
      },
  })
   .then(data=>{
     //console.log(data);
   })
   .catch(err=>{
     console.log(err);
   });
  dispatch({
    type: UPDATE_TODO,
    payload: updatedTodo
  });
};

export const filterTodos = (type, value) => dispatch => {
  //console.log(type,value);
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  //console.log(todos,'actioncenter');
  const filteredTodos = todos.filter(todo => {
    if (type === "general" && value === "all") {
      // return all
      return todo;
    } else if (type === "tag") {
      // search by tags
      let tags = JSON.parse(todo.tags);
      let hasTag = tags.filter(x => x.value === value).length !== 0;
      if (hasTag) {
        return todo;
      }
    }

    else {

      return todo[type] === value;
    }
  });

  dispatch({
    type: FILTER_TODO,
    payload: filteredTodos
  });
};

export const setTodosLoading = () => {
  return {
    type: TODOS_LOADING
  };
};
