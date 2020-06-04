import axios from "axios";
import {
  GET_CATEGORIES,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  CATEGORIES_LOADING
} from "./types.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const getCategories = () => dispatch => {
  dispatch(setCategoriesLoading());
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  /*if (categories.length) {
    dispatch({
      type: GET_CATEGORIES,
      payload: categories
    });
  } else {*/
    axios.get("https://todohack.herokuapp.com/allcategories",
    {
        headers: {
            "auth":localStorage.getItem("Token")
        },
    }
  ).then(res =>
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data
      })
    );
  //}
};

export const addCategory = category => dispatch => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  //categories.unshift(category);
  const {name,description,date}=category;
  const data={
    name,description,date
  }
  //console.log(category);
  axios.post('https://todohack.herokuapp.com/addCategory',data,
  {
      headers: {
          "auth":localStorage.getItem("Token")
      },
  })
   .then(data=>{
     //console.log(data);
     category._id=data.data._id;
     localStorage.setItem("categories", JSON.stringify(categories));
     dispatch({
       type: ADD_CATEGORY,
       payload: category
     });
   })
   .catch(err=>{
     console.log(err);
   });

};

export const deleteCategory = id => dispatch => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const newCategories = categories.filter(category => {
    return category._id !== id;
  });
  localStorage.setItem("categories", JSON.stringify(newCategories));
  axios.put('https://todohack.herokuapp.com/deleteCategory',{CategoryId:id})
   .then(data=>{
     //console.log(data);
   })
   .catch(err=>{
     console.log(err);
   });
  dispatch({
    type: DELETE_CATEGORY,
    payload: id
  });
};

export const setCategoriesLoading = () => {
  return {
    type: CATEGORIES_LOADING
  };
};
