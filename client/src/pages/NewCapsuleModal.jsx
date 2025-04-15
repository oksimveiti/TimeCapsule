import React, { useState } from 'react';
import AnimatedInput from '../components/AnimatedInput';
import ReusableButton from '../components/ReusableButton';

const NewCapsuleModal = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [hint, setHint] = useState('');
    const [color, setColor] = useState('#ff5733');
    const [openAt, setOpenAt] = useState('');
    const [openAtTime, setOpenAtTime] = useState('');
    const [dateError, setDateError] = useState('');

    // Function to validate the date is in the future
    const validateFutureDate = (date, time) => {
        if (!date) return true; // Skip validation if no date entered yet

        const selectedDateTime = new Date(`${date}T${time || '00:00'}`);
        const now = new Date();

        // Clear timezone/seconds/ms for today's date to compare just the date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If only date is selected (no time), validate it's at least tomorrow
        if (!time && selectedDateTime <= today) {
            return "Please select a future date";
        }

        // If both date and time are selected, validate it's in the future
        if (time && selectedDateTime <= now) {
            return "Please select a future date and time";
        }

        return ""; // No error
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setOpenAt(newDate);
        setDateError(validateFutureDate(newDate, openAtTime));
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setOpenAtTime(newTime);
        setDateError(validateFutureDate(openAt, newTime));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final validation before submission
        const errorMsg = validateFutureDate(openAt, openAtTime);
        if (errorMsg) {
            setDateError(errorMsg);
            return;
        }

        const combinedDateTime = new Date(`${openAt}T${openAtTime || '00:00'}`);

        // Debug date information
        console.log('Creating capsule with date info:');
        console.log('Date string:', `${openAt}T${openAtTime || '00:00'}`);
        console.log('Combined date object:', combinedDateTime);
        console.log('Current date:', new Date());
        console.log('Is future date?', combinedDateTime > new Date());

        const newCapsule = {
            title,
            message,
            hint,
            color,
            openAt: combinedDateTime,
            createdAt: new Date()
        };

        console.log('New capsule object:', newCapsule);
        onSubmit && onSubmit(newCapsule);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">New Capsule</h2>
                <form onSubmit={handleSubmit}>
                    <AnimatedInput label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <AnimatedInput label="Message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                    <AnimatedInput label="Hint" name="hint" value={hint} onChange={(e) => setHint(e.target.value)} required />
                    <div className="form-control">
                        <label htmlFor="color">Color</label>
                        <input type="color" name="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                    <AnimatedInput
                        label="Open Date"
                        name="openAt"
                        type="date"
                        className="date-input"
                        value={openAt}
                        onChange={handleDateChange}
                        required
                    />
                    <AnimatedInput
                        label="Open Time"
                        name="openAtTime"
                        type="time"
                        className="hour-input"
                        value={openAtTime}
                        onChange={handleTimeChange}
                    />

                    {dateError && <div className="date-error">{dateError}</div>}

                    <div className="modal-buttons">
                        <ReusableButton type="submit" accent="limegreen" disabled={!!dateError}>Create Capsule</ReusableButton>
                        <ReusableButton type="button" onClick={onClose} accent="crimson">Cancel</ReusableButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCapsuleModal;
