import React, { useState, useEffect } from 'react';
import './GetProfile.css'
import axios from 'axios';
import upload_area from '../../assets/upload_area1.png'
import { toast } from 'react-toastify';

const GetProfile = ({ url }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    <div className='get-profile-container'>
    {!isEditing ? (
    <div className='get-profile'>
      <div className="get-profile-div">
          {user.image && <img className='get-profile-img' src={`${url}/${user.image}`} alt="User Profile" />}
      </div>
      <div className='get-div'>
        <p><strong>Name:</strong> {user.name}</p>
      </div>
      <div className='get-div'>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className='get-profile-button'>
        <button className='get-button' onClick={() => setIsEditing(true)}>Edit Profile</button>
      </div>
    </div>
    ) : (
    <div className='get-profile'>
    <form onSubmit={handleSubmit}>
      <div className="get-profile-div">
          <label htmlFor='image'>
              <img className='get-profile-img' src={imageUrl} alt='' />
          </label>
          <input type="file" id='image' onChange={handleFileChange} hidden />
      </div>
      <div className='get-div'>
        <p><strong>Name:</strong></p>
        <input className='get-input' type="text" name='name' value={formData.name} onChange={handleInputChange} placeholder='Sooraj Jain'/>
      </div>
      <div className='get-div'>
        <p><strong>Email:</strong></p>
        <input className='get-input' type="email" name='email' value={formData.email} readOnly/>
      </div>
      <div className='get-div'>
        <p><strong>Password:</strong></p>
        <input className='get-input' type="password" name='password' value={formData.password} onChange={handleInputChange} placeholder='Enter new password'/>
      </div>
      <div className='get-profile-button'>
        <button className='get-button' type='submit'>Update</button>&nbsp;&nbsp;
        <button className='get-button' onClick={handleCancel}>Cancel</button>
      </div>
      </form>
    </div>
    )}
    </div>
  );
};
export default GetProfile;
