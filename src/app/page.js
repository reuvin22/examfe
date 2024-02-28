'use client';
import axios from "axios";
import { useEffect, useState } from "react";
export default function Home() {
  const [data, setData] = useState({
    author: '',
    post: ''
  });
  const [upData, setUpdate] = useState({
    id: '',
    author: '',
    post: ''
  });
  const [updateForm, setForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [trigger, setTrigger] = useState(true);

  const basedUrl = 'http://localhost:8000/api/post';
  const postData = async() => {
    try{
      const response = await axios.post(basedUrl, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setTrigger(!trigger);
      setData({
        author: '',
        post: ''
      });
    }catch(e){
      console.error(e);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
  }
  const handleInput = (e) => {
    const {name, value} = e.target;
    setData(prevData => ({
      ...prevData, [name]:value
    }));
  }

  const getAll = async () => {
    try {
      const response = await axios.get(basedUrl);
      setPosts(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAll();
  }, [trigger]);

  const delData = async(id) => {
    try{
      const response = await axios.delete(`${basedUrl}/${id}`);
      alert(response.data.message);
      setTrigger(!trigger);
    }catch(e){
      console.error(e);
    }
  }
  const getData = async(id) => {
    try{
      const response = await axios.get(`${basedUrl}/${id}`);
      setUpdate({
        id: id,
        author: response.data.data.author,
        post: response.data.data.post
      });
      setForm(!updateForm);
    }catch(e){
      console.log(e);
    }
  }
  const updateData = async () => {
    try {
      await axios.put(`${basedUrl}/${upData.id}`, upData, { 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      });
      setForm(!updateForm);
      setTrigger(!trigger);
    } catch (e) {
      console.error(e);
    }
  }

  const update = e => {
    e.preventDefault();
    updateData();
  }
  const handleUpdate = e => {
    const { name, value } = e.target;
    setUpdate(prevUpdate => ({
      ...prevUpdate, [name]:value
    }));
  }
  const closeForm = () => {
    setForm(!updateForm);
    console.log(updateForm);
  }
  return (
    <div className="border-2 w-[100%] h-[100vh] flex justify-center items-center bg-slate-500">
      <div className="border-2 h-96 w-[50%] sm:w-96 md:w-[80%] bg-blue-500">
        <form onSubmit={handleSubmit} className="rounded-lg h-20 w-full gap-10 flex justify-center">
        <input type="text" name="author" className="h-7 w-[30%] ml-5 border-2 mt-5 pl-2" placeholder="Author...." value={data.author} onChange={handleInput}/>
          <input type="text" name="post" className="h-7 w-[70%] border-2 mt-5 pl-2" placeholder="Post Here...." value={data.post} onChange={handleInput}/>
          <button type="submit" className="border-2 h-7 mt-5 hover:bg-blue-400 hover:text-white px-10 text-white mr-5">Post</button>
        </form>
        <div className={updateForm ? "border-2 h-64 sm:h-64 w-[40%] sm:w-[76%] lg:w-[50%] bg-slate-500 absolute ml-20 sm:ml-0 md:ml-24 md:h-64 lg:ml-0" : "hidden"}>
          <form onSubmit={update} className="grid gap-5 place-items-center mt-4 w-full">
            <input type="text" className="h-10 pl-5" name="author" value={upData.author} onChange={handleUpdate}/>
            <input type="text" className="h-10 pl-5" name="post" value={upData.post} onChange={handleUpdate}/>
            <button className="border-2 p-2 bg-green-600 text-white w-[48%]">Update</button>
            <h1 className="border-2 p-2 bg-red-600 text-white cursor-pointer text-center w-[48%]" onClick={closeForm}>Close</h1>
          </form>
        </div>
        <div className="max-h-72 overflow-x-hidden">
          <table className="ml-5 w-full text-white">
            <tbody>
              <tr>
                <td>Id</td>
                <td>Author</td>
                <td>Post</td>
                <td>Update/Delete</td>
              </tr>
              {posts.map(post => (
                <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.author}</td>
                    <td>{post.post}</td>
                      <button className="border-2 p-2 bg-green-600" onClick={() => getData(post.id)}>Update</button><button className="border-2 p-2 bg-red-600" onClick={() => delData(post.id)}>Delete</button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
