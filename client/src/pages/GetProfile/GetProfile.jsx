import React, { useState, useEffect } from 'react';
import axios from 'axios';
import upload_area from '../../assets/upload_area1.png'
import getprofile from '../../assets/getprofile.png'
import { toast } from 'react-toastify';

const GetProfile = ({ url }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(upload_area);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${url}/api/user/get-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setUser(response.data.user);
          setFormData({
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone,
            password: '',
          });
          setImageUrl(response.data.user.image ? `${url}/${response.data.user.image}` : upload_area);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Error fetching user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(newImageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('email', formData.email);
    formDataObj.append('phone', formData.phone);
    if (formData.password) formDataObj.append('password', formData.password);
    if (image) formDataObj.append('image', image);

    try {
      const response = await axios.put(`${url}/api/user/edit-user`, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          password: '',
        });
        setImage(null);
        setImageUrl(response.data.user.image ? `${url}/${response.data.user.image}` : upload_area);
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('Error updating profile');
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
    });
    setImage(null);
    setImageUrl(user.image ? `${url}/${user.image}` : upload_area);
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No User details available</div>;

  return (
    <div className='flex flex-row justify-center' style={{ backgroundImage: `url(${getprofile})`,backgroundSize: 'cover',backgroundPosition: 'center',
        }}>
    {!isEditing ? (
    <div className='w-[80%] mx-10 my-20 text-[#474747] text-base bg-blue-100 p-4 rounded-md flex flex-col 2xl:w-[25%] lg:w-[30%] md:w-[45%] sm:w-[60%] lg:mx-20'>
      <div className="flex justify-center items-center m-4">
          {user.image && <img className='w-32 rounded-full border border-blue-500' src={`${url}/${user.image}`} alt="User Profile" />}
      </div>
      <div className='m-4'>
        <p><strong>Name:</strong> {user.name}</p>
      </div>
      <div className='m-4'>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className='m-4'>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
      <div className='flex justify-center items-center m-4'>
        <button className='bg-blue-600 text-white px-4 py-2 rounded-md' onClick={() => setIsEditing(true)}>Edit Profile</button>
      </div>
    </div>
    ) : (
    <div className='w-[80%] mx-10 my-20 text-[#474747] text-base bg-blue-200 p-4 rounded-md flex flex-col 2xl:w-[25%] lg:w-[30%] md:w-[45%] sm:w-[60%] lg:mx-20'>
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center items-center m-4">
          <label htmlFor='image'>
              <img className='w-32 rounded-full' src={imageUrl} alt='' />
          </label>
          <input type="file" id='image' onChange={handleFileChange} hidden />
      </div>
      <div className='m-4'>
        <p><strong>Name:</strong></p>
        <input className='ml-2 p-2 border border-none text-sm' type="text" name='name' value={formData.name} onChange={handleInputChange} placeholder='Sooraj Jain'/>
      </div>
      <div className='m-4'>
        <p><strong>Email:</strong></p>
        <input className='ml-2 p-2 border border-none text-sm' type="email" name='email' value={formData.email} readOnly/>
      </div>
      <div className='m-4'>
        <p><strong>Phone:</strong></p>
        <input className='ml-2 p-2 border border-none text-sm' type="tel" name='phone' value={formData.phone} onChange={handleInputChange} placeholder='Enter your phone number'/>
      </div>
      <div className='m-4'>
        <p><strong>Password:</strong></p>
        <input className='ml-2 p-2 border border-none text-sm' type="password" name='password' value={formData.password} onChange={handleInputChange} placeholder='Enter new password'/>
      </div>
      <div className='flex justify-center items-center m-4 gap-4'>
        <button className='bg-blue-600 text-white px-4 py-2 rounded-md' type='submit'>Update</button>
        <button className='bg-blue-600 text-white px-4 py-2 rounded-md' onClick={handleCancel}>Cancel</button>
      </div>
      </form>
    </div>
    )}
    </div>
  );
};
export default GetProfile;
