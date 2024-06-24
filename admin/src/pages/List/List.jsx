// import React, { useEffect, useState, useCallback } from 'react';
// import './List.css';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const List = ({ url }) => {

//   // const url = 'http://localhost:4000';
//   const [list, setList] = useState([]);

//   const fetchList = useCallback(async () => {
//     try {
//       const response = await axios.get(`${url}/api/food/list`);
//       console.log(response.data);
//       if (response.data.success) {
//         setList(response.data.data);
//       } else {
//         toast.error("Error");
//       }
//     } catch (error) {
//       toast.error("Error fetching the list");
//     }
//   }, [url]);

//   const removeFood = async (foodId) => {
//     try {
//       const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
//       await fetchList();
//       if (response.data.success) {
//         toast.success(response.data.message);
//       } else {
//         toast.error("Error");
//       }
//     } catch (error) {
//       toast.error("Error removing the food item");
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//     <div className='list add flex-col'>
//       <p>All Foods List</p>
//       <div className="list-table">
//         <div className="list-table-format title">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b>Action</b>
//         </div>
//         {list.map((item, index) => (
//           <div key={index} className="list-table-format">
//             <img src={`${url}/images/` + item.image} alt="" />
//             <p>{item.name}</p>
//             <p>{item.category}</p>
//             <p>Rs.{item.price}</p>
//             <p onClick={() => removeFood(item._id)} className='cursor'>x</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default List;
import React, { useEffect, useState, useCallback } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {

  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
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
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
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

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = list.slice(startIdx, endIdx);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {currentItems.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>Rs.{item.price}</p>
            <p onClick={() => removeFood(item._id)} className='cursor'>x</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default List;

