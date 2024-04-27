const NavigationButtons = ({ nextStep, prevStep, isFinalStep }) => (
    <div>
        {prevStep && <button onClick={prevStep}>Back</button>}
        <button onClick={nextStep}>{isFinalStep ? 'Confirm' : 'Next'}</button>
    </div>
)

export default NavigationButtons