import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import Notification from '@/Components/Notification';

const initialAnnouncements = [
  { id: 1, title: 'Water Interruption', content: 'There will be a scheduled water interruption on May 25, 2025.' },
  { id: 2, title: 'Maintenance Notice', content: 'Routine maintenance will be conducted on June 1, 2025.' },
];

const durationOptions = [
  { label: '1 day', value: 1 },
  { label: '1 week', value: 7 },
  { label: '1 month', value: 30 },
];

const Announcement = () => {
  const { auth } = usePage().props;
  const [profilePicture, setProfilePicture] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', start_date: '', end_date: '' });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchAnnouncements();
    fetchProfileData();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      showNotification('Failed to fetch announcements', 'error');
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('/api/admin/profile');
      if (response.data && response.data.profile_picture) {
        setProfilePicture(response.data.profile_picture);
      }
    } catch (error) {
      // ignore error for now
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateDuration = (start, end) => {
    if (!start || !end) return true;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const maxEnd = new Date(startDate);
    maxEnd.setMonth(maxEnd.getMonth() + 1);
    return endDate <= maxEnd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDuration(form.start_date, form.end_date)) {
      showNotification('End date must not be more than 1 month after start date', 'error');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/announcements/${editingId}`, {
          title: form.title,
          content: form.content,
          start_date: form.start_date,
          end_date: form.end_date
        });
        showNotification('Announcement updated successfully');
      } else {
        await axios.post('/api/announcements', {
          title: form.title,
          content: form.content,
          start_date: form.start_date,
          end_date: form.end_date
        });
        showNotification('Announcement created successfully');
      }
      fetchAnnouncements();
      setForm({ title: '', content: '', start_date: '', end_date: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
      showNotification(error.response?.data?.message || 'Failed to save announcement', 'error');
    }
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      content: announcement.body,
      start_date: new Date(announcement.published_at).toISOString().split('T')[0],
      end_date: new Date(announcement.expired_at).toISOString().split('T')[0],
    });
    setEditingId(announcement.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await axios.delete(`/api/announcements/${id}`);
      showNotification('Announcement deleted successfully');
      fetchAnnouncements();
      if (editingId === id) {
        setForm({ title: '', content: '', start_date: '', end_date: '' });
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showNotification('Failed to delete announcement', 'error');
    }
  };

  return (
    <DynamicTitleLayout userRole="admin">
      <div className="min-h-screen bg-[#60B5FF] font-[Poppins] overflow-x-hidden">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 md:translate-x-0 -translate-x-full flex flex-col">
          <div className="p-3 flex-shrink-0">
            <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="w-50 h-50 mx-auto mb-3" />
          </div>
          <nav className="flex flex-col flex-1 overflow-y-auto">
            <div className="flex-1 pb-4">
              <Link href="/admin/dashboard" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">dashboard</span>
                Dashboard
              </Link>
              <Link href="/admin/announcement" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/announcement' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">campaign</span>
                Announcement
              </Link>
              <Link href="/admin/accounts" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/accounts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">manage_accounts</span>
                Manage Accounts
              </Link>
              <Link href="/admin/rate-management" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/rate-management' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">price_change</span>
                Rate Management
              </Link>
              <Link href="/admin/payment" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/payment' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">payments</span>
                Payment
              </Link>
              <Link href="/admin/reports" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">description</span>
                Reports
              </Link>
              <Link href="/admin/tickets" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/tickets' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">confirmation_number</span>
                Tickets
              </Link>
              <Link href="/admin/profile" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="material-symbols-outlined mr-3">person</span>
                Profile
              </Link>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    try {
                      await axios.get('/sanctum/csrf-cookie');
                      await axios.post('/admin/logout');
                      window.location.href = '/';
                    } catch (error) {
                      window.location.href = '/';
                    }
                  }
                }}
                className="flex items-center px-6 py-3 text-base text-gray-600 hover:text-red-600 hover:bg-red-50 w-full text-left"
              >
                <span className="material-symbols-outlined mr-3">logout</span>
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white h-14 flex items-center justify-between px-4 z-20">
          <button className="text-gray-600 hover:text-gray-800">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="h-8" />
          <div></div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-[240px] p-3 sm:p-4 md:p-6 lg:p-6 pt-16 lg:pt-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h1 className="text-xl font-semibold">Announcements</h1>
            <div className="flex items-center w-full sm:w-auto gap-2">
              <Link href="/admin/profile">
                <img
                  src={profilePicture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=0D8ABC&color=fff`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover"
                />
              </Link>
            </div>
          </div>

          {/* Notification Component */}
          {notification.show && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />
          )}

          {/* Announcement CRUD Feature */}
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <textarea
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                required
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'} Announcement
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setForm({ title: '', content: '', start_date: '', end_date: '' }); setEditingId(null); }}
                  className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </form>
            <ul className="space-y-6">
              {announcements.map(a => (
                <li key={a.id} className="border rounded-2xl p-8 flex flex-col gap-2 bg-gray-50 shadow-md">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-blue-800">{a.title}</h2>
                    <div>
                      <button
                        onClick={() => handleEdit(a)}
                        className="mr-2"
                        title="Edit"
                      >
                        <img src="https://cdn-icons-png.flaticon.com/512/6325/6325975.png" alt="Edit" className="w-6 h-6 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Delete" className="w-6 h-6 inline" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DynamicTitleLayout>
  );
};

export default Announcement; 