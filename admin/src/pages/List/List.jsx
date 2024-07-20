import React, { useEffect, useState, useCallback, useRef } from 'react';
import './List.css';
import '../Add/Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const List = ({ url }) => {

  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const itemsPerPage = 10;
  const formRef = useRef(null);

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/listactive-food`);
      console.log(response.data);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching the list");
    }
  }, [url]);

  const removeFood = async (foodId) => {
    try {
      const response = await axios.put(`${url}/api/food/deactivate-food`, { id: foodId });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error removing the food item");
    }
  };

  const editFood = (food) => {
    setData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
    });
    setImage(null); // Clear the image input
    setCurrentEditId(food._id);
    setIsEditMode(true);
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (isEditMode && formRef.current) {
      window.scrollTo({ top: formRef.current.offsetTop, behavior: 'smooth' });
    }
  }, [isEditMode]);

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = list.slice(startIdx, endIdx);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [image,setImage] = useState(false);
  const [data,setData] = useState({
    name:"",
    description:"",
    price:"",
    category:"Salad"
  });

  const onChangeHandler =(event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.append("id",currentEditId);
    formData.append("name",data.name)
    formData.append("description",data.description)
    formData.append("price",Number(data.price))
    formData.append("category",data.category)
    if(image){
      formData.append("image",image);
    }
    const response =await axios.put(`${url}/api/food/edit`,formData);
    if(response.data.success){
      setData({
        name:"",
        description:"",
        price:"",
        category:""
      })
      setImage(false);
      setIsEditMode(false);
      setCurrentEditId(null);
      toast.success(response.data.message);
      await fetchList();
    } else{
      toast.error(response.data.message)
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setCurrentEditId(null);
    setData({
      name: "",
      description: "",
      price: "",
      category: "Salad",
    });
    setImage(false);
  };

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {currentItems.map((item, index) => (
          <div key={index} className="list-table-format-items">
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>Rs.{item.price}</p>
            <p onClick={() => removeFood(item._id)} className='cursor'><FaTrash /></p>
            <p onClick={() => editFood(item)} className='cursor'><FaEdit /></p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      </div>
      {isEditMode && (
      <form ref={formRef} className='flex-col' onSubmit={onSubmitHandler}>
      <div className="add-img-upload flex-col">
        <p>Upload Image</p>
        <label htmlFor='image'>
          <img src={image?URL.createObjectURL(image):assets.upload_area} alt=''/>
        </label>
        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden/>
      </div>
      <div className="add-product-name flex-col">
        <p>Product name</p>
        <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required/>
      </div>
      <div className="add-product-description flex-col">
        <p>Product description</p>
        <textarea onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='Write content here' required></textarea>
      </div>
      <div className="add-category-price">
        <div className="add-category flex-col">
          <p>Product category</p>
          <select onChange={onChangeHandler} name="category" >
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
            <option value="Chats">Chats</option>
            <option value="Fruit Juice">Fruit Juice</option>
            <option value="Icecream">Icecream</option>
            <option value="Coffee&Tea">Coffee&Tea</option>
          </select>
        </div>
        <div className="add-price flex-col">
          <p>Product price</p>
          <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='Rs.20'/>
        </div>
      </div><br/>
      <div className='button-box'>
          <button type='submit' className='update-btn'>UPDATE</button>&nbsp;&nbsp;
          <button type='button' className='update-btn' onClick={handleCancel}>CANCEL</button>
      </div>
  </form>
    )}
    </div>
  );
}

export default List;

