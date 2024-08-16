import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Calendar, Camera, Droplet, Search, ChevronLeft, ChevronRight, Power, X, Edit2, Check } from 'lucide-react';

const initialDashboardData = {
  isCleanerOn: false,
  isActive: false,
  onOffHistory: [
    { state: false, time: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { state: true, time: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { state: false, time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { state: true, time: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { state: false, time: new Date() },
  ],
  lastCleaningTime: '2 hours ago',
  imagesCaptured: 0
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleCleaner = async () => {
    try {
      const newState = !dashboardData.isCleanerOn;
      const response = await axios.post('/api/cleaner/toggle', { state: newState });
      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          isCleanerOn: response.data.newState,
          onOffHistory: [...prev.onOffHistory.slice(-4), { state: newState, time: new Date() }]
        }));
      }
    } catch (error) {
      console.error('Error toggling cleaner:', error);
    }
  };

  const toggleActive = async () => {
    try {
      const newActiveState = !dashboardData.isActive;
      const response = await axios.post('/api/cleaner/active', { active: newActiveState });
      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          isActive: response.data.newActiveState
        }));
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <nav className="bg-gray-800 shadow w-full">
        <div className="px-4 py-4">
          <span className="text-2xl font-bold text-white">Solar Cleaner</span>
        </div>
      </nav>

      <main className="flex-1 w-full px-4 py-6 space-y-4">
        {/* Cleaner Control */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Droplet className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-lg font-medium text-white">Cleaner Control</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm font-medium text-gray-400 mr-2">Status:</span>
              <span className={`font-medium ${dashboardData.isCleanerOn ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.isCleanerOn ? 'ON' : 'OFF'}
              </span>
            </div>
            <button
              onClick={toggleCleaner}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                dashboardData.isCleanerOn
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {dashboardData.isCleanerOn ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm font-medium text-gray-400 mr-2">Active Status:</span>
              <span className={`font-medium ${dashboardData.isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {dashboardData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <button
              onClick={toggleActive}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                dashboardData.isActive
                  ? 'bg-gray-500 text-white hover:bg-gray-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {dashboardData.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Activity</h4>
            <div className="flex justify-between">
              {dashboardData.onOffHistory && dashboardData.onOffHistory.map((event, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Power className={`h-4 w-4 ${event.state ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-xs text-gray-500 mt-1">
                    {event.time && event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last Cleaning */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-lg font-medium text-white">Last Cleaning</span>
            </div>
          </div>
          <div className="bg-gray-700 p-4">
            <button
              onClick={() => setShowSchedule(true)}
              className="w-full text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              View schedule
            </button>
          </div>
        </div>

        {/* Images Captured */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center">
              <Camera className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-lg font-medium text-white">Images Captured</span>
            </div>
          </div>
          <div className="bg-gray-700 p-4">
            <button className="w-full text-sm font-medium text-cyan-400 hover:text-cyan-300">
              View all
            </button>
          </div>
        </div>

        {/* ML Output Viewer */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">ML Output Viewer</h3>
          <MLOutputViewer />
        </div>
      </main>

      {/* Schedule Modal */}
      {showSchedule && (
        <ScheduleModal onClose={() => setShowSchedule(false)} />
      )}
    </div>
  );
};

const placeholderMLData = {
  batches: [
    {
      id: '1',
      name: 'Batch 2023-05-01',
      date: '2023-05-01',
      damageCount: 5,
      images: [
        { id: '1a', url: 'https://example.com/batch1-image1.jpg', damageCount: 2 },
        { id: '1b', url: 'https://example.com/batch1-image2.jpg', damageCount: 3 },
      ]
    },
    {
      id: '2',
      name: 'Batch 2023-05-02',
      date: '2023-05-02',
      damageCount: 3,
      images: [
        { id: '2a', url: 'https://example.com/batch2-image1.jpg', damageCount: 3 },
      ]
    },
    {
      id: '3',
      name: 'Batch 2023-05-03',
      date: '2023-05-03',
      damageCount: 7,
      images: [
        { id: '3a', url: 'https://example.com/batch3-image1.jpg', damageCount: 2 },
        { id: '3b', url: 'https://example.com/batch3-image2.jpg', damageCount: 3 },
        { id: '3c', url: 'https://example.com/batch3-image3.jpg', damageCount: 2 },
      ]
    },
    { id: '4', name: 'Batch 2023-05-04', date: '2023-05-04', damageCount: 2, images: [{ id: '4a', url: 'https://example.com/placeholder4.jpg', damageCount: 2 }] },
    { id: '5', name: 'Batch 2023-05-05', date: '2023-05-05', damageCount: 4, images: [{ id: '5a', url: 'https://example.com/placeholder5.jpg', damageCount: 4 }] },
  ],
  totalCount: 5
};

const MLOutputViewer = () => {
  const [batches, setBatches] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const batchesPerPage = 5;

  useEffect(() => {
    const fetchBatches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/batches', {
          params: { page: currentPage, search: searchTerm }
        });
        setBatches(response.data.batches);
        setTotalCount(response.data.totalCount);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching batches:', error);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBatches();
  }, [currentPage, searchTerm]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5">
        {/* Search Bar */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search batches..."
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Batch List */}
        {batches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">Damages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">Action</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{batch.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{batch.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{batch.damageCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">No batches found.</div>
        )}

        {/* Pagination */}
        {batches.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Showing <span className="font-medium">{Math.min((currentPage - 1) * batchesPerPage + 1, totalCount)}</span> to <span className="font-medium">{Math.min(currentPage * batchesPerPage, totalCount)}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage * batchesPerPage >= totalCount}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Selected Batch Details */}
        {selectedBatch && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              {selectedBatch.name} Details
            </h4>
            <p className="text-sm text-gray-300 mb-2">
              Date: {selectedBatch.date} | Total Damages Detected: {selectedBatch.damageCount}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedBatch.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={`${selectedBatch.name} image`}
                    className="w-full h-32 object-cover rounded-lg shadow-inner cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  <span className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    Damages: {image.damageCount}
                  </span>
                </div>
              ))}
            </div>
            {selectedImage && (
              <div className="mt-4">
                <h5 className="text-md font-medium text-white mb-2">Selected Image</h5>
                <img
                  src={selectedImage.url}
                  alt="Selected image"
                  className="w-full h-64 object-contain rounded-lg shadow-inner"
                />
                <p className="text-sm text-gray-300 mt-2">
                  Damages Detected: {selectedImage.damageCount}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleModal = ({ onClose }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDay, setEditDay] = useState('');
  const [editTime, setEditTime] = useState('');
  const [newDay, setNewDay] = useState('Monday');
  const [newTime, setNewTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/schedule');
        setScheduleData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Failed to load schedule. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const startEditing = (index, day, time) => {
    setEditingIndex(index);
    setEditDay(day);
    setEditTime(time);
  };

  const saveEdit = async (index) => {
    try {
      const newScheduleData = [...scheduleData];
      newScheduleData[index] = { day: editDay, time: editTime };
      const response = await axios.put('/api/schedule', newScheduleData);
      if (response.data.success) {
        setScheduleData(response.data.updatedSchedule);
        setEditingIndex(null);
      }
    } catch (error) {
      console.error('Error saving schedule edit:', error);
    }
  };

  const deleteSchedule = async (index) => {
    try {
      const response = await axios.delete(`/api/schedule/${index}`);
      if (response.data.success) {
        const newScheduleData = scheduleData.filter((_, i) => i !== index);
        setScheduleData(newScheduleData);
      }
    } catch (error) {
      console.error('Error deleting schedule item:', error);
    }
  };

  const addNewSchedule = async () => {
    if (newDay && newTime) {
      try {
        const response = await axios.post('/api/schedule', { day: newDay, time: newTime });
        if (response.data.success) {
          setScheduleData([...scheduleData, response.data.newScheduleItem]);
          setNewDay('Monday');
          setNewTime('');
        }
      } catch (error) {
        console.error('Error adding new schedule item:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-gray-800">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-white">Loading Schedule...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-gray-800">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-white">{error}</h3>
            <div className="mt-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-white text-center mb-4">Cleaning Schedule</h3>
          <div className="mt-2">
            <div className="space-y-4">
              {Array.isArray(scheduleData) && scheduleData.length > 0 ? (
                scheduleData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      {editingIndex === index ? (
                        <select
                          value={editDay}
                          onChange={(e) => setEditDay(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                        >
                          {daysOfWeek.map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-white">{item.day}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      {editingIndex === index ? (
                        <input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                        />
                      ) : (
                        <span className="text-gray-300">{item.time}</span>
                      )}
                    </div>
                    <div>
                      {editingIndex === index ? (
                        <button
                          onClick={() => saveEdit(index)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(index, item.day, item.time)}
                            className="text-blue-400 hover:text-blue-300 mr-2"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteSchedule(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-300">No schedule data available.</p>
              )}
            </div>
          </div>
          {/* Add new schedule form */}
          <div className="mt-4 flex items-center space-x-2">
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            />
            <button
              onClick={addNewSchedule}
              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-cyan-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;