import React, { useState } from 'react';
import GuestDetailsForm from './GuestDetailsForm';
import PersonalInfoForm from './PersonalInfoForm';
import ReviewConfirm from './ReservationReviewConfirm';
import StepNavigationButtons from '../Buttons/StepNavigationButtons';

const ReservationForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        guests: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: ''
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (input) => (e) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    switch(step) {
        case 1:
            return (
                <>
                    <GuestDetailsForm handleChange={handleChange} formData={formData} />
                    <StepNavigationButtons nextStep={nextStep} />
                </>
            );
        case 2:
            return (
                <>
                    <PersonalInfoForm handleChange={handleChange} formData={formData} />
                    <StepNavigationButtons nextStep={nextStep} prevStep={prevStep} />
                </>
            );
        case 3:
            return (
                <>
                    <ReviewConfirm formData={formData} />
                    <StepNavigationButtons nextStep={nextStep} prevStep={prevStep} isFinalStep={true} />
                </>
            );
        default:
            return <div>Something went wrong.</div>;
    }
};

export default ReservationForm;
