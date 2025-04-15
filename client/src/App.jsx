import { useState, useEffect } from 'react'
import './css/App.css';
import './css/NewCapsuleModal.css'
import NewCapsuleModal from './pages/NewCapsuleModal';
import ReusableButton from './components/ReusableButton';

function App() {
  const [capsules, setCapsules] = useState([]);
  const [hiddenCapsules, setHiddenCapsules] = useState(() => {
    // Initialize hidden capsules from localStorage if available
    const stored = localStorage.getItem('hiddenCapsules');
    return stored ? JSON.parse(stored) : [];
  });

  // Add state to track future capsules for our counter
  const [futureCapsules, setFutureCapsules] = useState([]);

  // Add state to force re-renders to update countdowns
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute to refresh countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Check if any capsules need to be moved from future to present
      const now = new Date();
      const stillFuture = futureCapsules.filter(capsule => new Date(capsule.openAt) > now);

      // If some capsules are now open, update the state
      if (stillFuture.length !== futureCapsules.length) {
        setFutureCapsules(stillFuture);
        // Force a re-fetch of capsules to update UI
        fetchCapsules();
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [futureCapsules]);

  const fetchCapsules = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/capsules');
      const data = await res.json();
      console.log('Data received from API:', data);

      // Debug current date
      console.log('Current date:', new Date().toISOString());

      const parsedData = data.map(capsule => {
        const parsedCapsule = {
          ...capsule,
          openAt: new Date(capsule.openAt),
          createdAt: new Date(capsule.createdAt)
        };
        // Debug individual capsule dates
        console.log(`Capsule ${capsule._id} openAt:`, new Date(capsule.openAt).toISOString());
        console.log(`Is future date? ${new Date() < new Date(capsule.openAt)}`);
        return parsedCapsule;
      });

      console.log('Parsed data:', parsedData);
      setCapsules(parsedData);

      // Track future capsules for our counter
      const future = parsedData.filter(c => c.openAt > new Date());
      setFutureCapsules(future);
    } catch (err) {
      console.error('Failed to fetch capsules:', err);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  useEffect(() => {
    // Save hidden capsules to localStorage whenever it changes
    localStorage.setItem('hiddenCapsules', JSON.stringify(hiddenCapsules));
  }, [hiddenCapsules]);

  const [showModal, setShowModal] = useState(false);

  const handleAddCapsule = async (newCapsule) => {
    try {
      console.log('Sending new capsule to server:', newCapsule);
      const response = await fetch('http://localhost:5500/api/capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCapsule)
      });

      const savedCapsule = await response.json();
      console.log('Received saved capsule from server:', savedCapsule);

      // Properly parse the dates before adding to state
      const parsedCapsule = {
        ...savedCapsule,
        openAt: new Date(savedCapsule.openAt),
        createdAt: new Date(savedCapsule.createdAt)
      };

      console.log('Parsed saved capsule:', parsedCapsule);
      console.log('Is future date?', parsedCapsule.openAt > new Date());

      setCapsules(prev => [...prev, parsedCapsule]);

      // Update future capsules if needed
      if (parsedCapsule.openAt > new Date()) {
        setFutureCapsules(prev => [...prev, parsedCapsule]);
      }
    } catch (error) {
      console.error('Failed to save capsule:', error);
    } finally {
      setShowModal(false);
    }
  };

  const handleDeleteCapsule = async (id) => {
    try {
      await fetch(`http://localhost:5500/api/capsules/${id}`, {
        method: 'DELETE'
      });
      setCapsules(prev => prev.filter(capsule => capsule._id !== id));

      // Update future capsules if needed
      setFutureCapsules(prev => prev.filter(capsule => capsule._id !== id));

      // Also remove from hidden capsules if it was there
      if (hiddenCapsules.includes(id)) {
        setHiddenCapsules(prev => prev.filter(capsuleId => capsuleId !== id));
      }
    } catch (error) {
      console.error('Failed to delete capsule:', error);
    }
  };

  const handleHideCapsule = (id) => {
    setHiddenCapsules(prev => [...prev, id]);
  };

  const shouldShowCapsule = (capsule) => {
    // If it's past the unlock time, always show it
    if (new Date() >= capsule.openAt) {
      // Remove from hidden list if it was previously hidden
      if (hiddenCapsules.includes(capsule._id)) {
        setHiddenCapsules(prev => prev.filter(id => id !== capsule._id));
      }
      return true;
    }

    // Otherwise, show only if not in hidden list
    return !hiddenCapsules.includes(capsule._id);
  };

  const getRemainingTime = (openAt) => {
    const now = new Date();

    // Create a clean date object for the opening date (without modifying it)
    const openDate = new Date(openAt);

    // Calculate the difference in milliseconds
    const diff = openDate - now;

    if (diff <= 0) return "🔓 Capsule is now open!";

    // Calculate days, hours, minutes correctly
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `⏳ ${days} days ${hours} hours ${minutes} minutes left`;
  };

  // Calculate the number of hidden capsules
  const hiddenCount = hiddenCapsules.length;
  const futureCapsuleCount = futureCapsules.length;

  return (
    <>
      <button onClick={() => setShowModal(true)} className="open-modal-button">+ New Capsule</button>
      <h1 className="site-title">Time Capsule</h1>
      <div className='capsule-grid'>
        {Array.isArray(capsules) && capsules.length === 0 ? (
          <p className="empty-message">No capsules yet. Click the "New Capsule" button above to create one!</p>
        ) : (
          capsules.filter(shouldShowCapsule).map((capsule, index) => {
            const now = new Date();
            const isFuture = capsule.openAt > now;

            return (
              <div
                className="capsule-card"
                key={capsule._id}
                style={
                  isFuture
                    ? {
                      boxShadow: `0 0px 16px ${capsule.color}`,
                      color: '#fff'
                    }
                    : {}
                }
              >
                {!isFuture ? (
                  <>
                    <h2 className='title'>{capsule.title}</h2>
                    <div className="capsule-content">
                      <p className='message'><span className="label">Message:</span>{capsule.message}</p>
                      <p className='hint'><span className="label">Hint:</span>{capsule.hint}</p>
                      <p className='openAt'><span className="label">Opened on:</span>{capsule.openAt.toDateString()}</p>
                    </div>
                    <div className="capsule-footer">
                      <ReusableButton
                        className="delete-button"
                        align="center"
                        accent="crimson"
                        onClick={() => handleDeleteCapsule(capsule._id)}
                      >
                        Delete Capsule
                      </ReusableButton>
                    </div>
                  </>
                ) : (
                  <div className='locked-capsule'>
                    <button
                      className="hide-capsule-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHideCapsule(capsule._id);
                      }}
                      title="Hide the Capsule until the opening date"
                    >
                      ✕
                    </button>
                    <p className='openAt'>🔒 Opens on: {capsule.openAt.toDateString()}</p>
                    <p className="countdown">{getRemainingTime(capsule.openAt)}</p>
                    <p className='hint'>💡 Hint: {capsule.hint}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {showModal && (
        <NewCapsuleModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddCapsule}
        />
      )}


      {hiddenCount > 0 && (
        <div className="hidden-capsules-counter">
          {hiddenCount} hidden {hiddenCount === 1 ? 'capsule' : 'capsules'} waiting to be opened
          {hiddenCount < futureCapsuleCount && ` (${futureCapsuleCount - hiddenCount} visible)`}
        </div>
      )}


      <a
        href="https://github.com/oksimveiti"
        target="_blank"
        rel="noopener noreferrer"
        className="creator-signature"
      >
        Developed by Semih Cetin
      </a>
    </>
  )
}

export default App
