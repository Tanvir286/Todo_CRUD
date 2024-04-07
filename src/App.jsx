import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set,push,onValue,remove} from "firebase/database";

const App = () => {

  const db = getDatabase();
  let [post,setPostData] = useState("");
  let [postList,setPostList] = useState([]);
  let [isUpdate,setIsupdate] = useState(false);
  let [id,setId] = useState("")


  // Write and Change Part Here 

  const handleChange = (e) => { 
    setPostData(e.target.value); 
   }

  // Data Post Part Here 

  const handlePost = () =>{
  // here push create a unique id
    set(push(ref(db, 'todo')), {
     task: post
    }).then(() =>{
      setPostData("");
    })
  }
    
  // This is read part here

  useEffect(()=>{
     const todoRef = ref(db, 'todo');
     onValue(todoRef, (snapshot) => {

      let arr = []

      /* console.log(snapshot.val()); diye sob data golo chole ase */
      snapshot.forEach(item =>{
          // arr.push(item.val());
          arr.push({...item.val(),id:item.key});
      })
      console.log(arr);
      setPostList(arr);
      
     });
  },[])


  // HandleDelete Part Here

  let handleDelete = (item) =>{
    //console.log(item);
    remove(ref(db, 'todo/'+item.id)); 
  }
 

  // HandleEdit Part Here

  let handleEdit = (item) =>{
    console.log(item);
    setId(item.id)
    setPostData(item.task)
    setIsupdate(true);
  }

 
  // HandleUpdate Part Here

  let handleUpdate = () =>{
    set(ref(db, 'todo/' + id), {
      task: post
     }).then(() =>{
       setPostData("");
       setIsupdate(!isUpdate);
     })
  }




  return (
    <div>
      <h1 className='text-5xl text-blue-600 text-center mt-5 border-b-4 pb-2'>This is Firebase Todo</h1>
      <div className='text-center mt-5'>

            {/* input box start here  */}
           <input type="text" 
            className='border-4 border-blue-300 w-[300px] py-3 outline-none mr-5 px-5'
            onChange={handleChange}
            value={post}
           />
            {/* Input box End here  */}
            {/* Submit box start here  */}
            {
              !isUpdate &&
              <button className='p-3 border text-xl bg-blue-300' onClick={handlePost}>Post Here</button>
            }
           {
             isUpdate &&
             <button className='p-3 border text-xl bg-blue-300' onClick={handleUpdate}>Update</button>
           }
            {/* Submit box End here  */}
            {/* Show Output box here  */}
            <ul>
               {postList.map((item,index) => (
                  <li key={index} 
                      className='text-xl mt-5 -ml-36'> 
                      {item.task} 
                      <button className='border px-3 py-2 ml-2 bg-blue-500' onClick={()=>handleEdit(item)} >edit</button> 
                      <button className='border px-3 py-2 ml-2 bg-red-500' onClick={()=>handleDelete(item)} >delete</button> 
                  </li>
               ))}
            </ul>
      </div>
    </div>
  );
};

export default App;