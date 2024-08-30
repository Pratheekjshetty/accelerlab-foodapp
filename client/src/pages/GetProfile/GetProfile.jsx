import React, { useState, useEffect } from 'react';
import './GetProfile.css'
import axios from 'axios';
import profile_icon from '../../assets/profile_icon.jpg'
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import getprofile from '../../assets/getprofile.jpg'
import { toast } from 'react-toastify';

const GetProfile = ({ url }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(profile_icon);

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
            confirmPassword: '',
          });
          const userImage = response.data.user.image ? `${url}/${response.data.user.image}` : profile_icon;
          axios.get(userImage)
          .then(() => {
            setImageUrl(userImage);
          })
          .catch(() => {
            setImageUrl(profile_icon);
          });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
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
          confirmPassword: '',
        });
        setImage(null);
        const userImage = response.data.user.image ? `${url}/${response.data.user.image}` : profile_icon;
        axios.get(userImage)
        .then(() => {
          setImageUrl(userImage);
        })
        .catch(() => {
          setImageUrl(profile_icon);
        });
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message
      ? err.response.data.message
      : 'Error updating profile';
      toast.error(message);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
    });
    setImage(null);
    const userImage = user.image ? `${url}/${user.image}` : profile_icon;
    axios.get(userImage)
    .then(() => {
      setImageUrl(userImage);
    })
    .catch(() => {
      setImageUrl(profile_icon);
    });
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No User details available</div>;

  return (
    <div className='get-profile-container' style={{ backgroundImage: `url(${getprofile})`,backgroundSize: 'cover',backgroundPosition: 'center',}}>
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
      <div className='get-div'>
        <p><strong>Role:</strong> {user.role}</p>
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
      <div className='get-div1'>
        <p><strong>Password:</strong></p>
        <input className='get-input' type={showPassword?"text" : "password"} name='password' value={formData.password} onChange={handleInputChange} placeholder='Enter new password'/>
        <span onClick={togglePasswordVisibility} className="toggle-password-visibility">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className='get-div1'>
        <p><strong>Confirm Password:</strong></p>
        <input className='get-input' type={showConfirmPassword?'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password"/>
        <span onClick={toggleConfirmPasswordVisibility} className="toggle-password-visibility">
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className='get-profile-button relative'>
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
