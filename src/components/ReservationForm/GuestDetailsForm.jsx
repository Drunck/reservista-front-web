const GuestDetailsForm = ({ formData, handleChange }) => {
    return (
        <div className="guest-details-form">
            <h2>Guest Details</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="guests">Number of Guests:</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange('guests')}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange('date')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange('time')}
                        required
                    />
                </div>
            </form>
        </div>
    );
};

export default GuestDetailsForm;
