import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category,setCategory}) => {
    const {food_list}=useContext(StoreContext);

    const handleSelectChange = (e) => {
      setCategory(e.target.value);
    };
  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div>
          <select value={category} onChange={handleSelectChange}>
            <option value="Salad" >Salad</option>
            <option value="Rolls" >Rolls</option>
            <option value="Deserts" >Deserts</option>
            <option value="Sandwich" >Sandwitch</option>
          </select>
        </div>
        <div className="food-display-list">
            {food_list.map((item,index)=>{
              // console.log(category,item.category);
              if(category==="All" || category===item.category){
                return (
                  <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
                )
              }
              return null;
            })}
        </div>
    </div>
  )
}

export default FoodDisplay