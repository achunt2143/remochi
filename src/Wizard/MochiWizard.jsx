// MochiWizard.jsx
import React, { useState } from 'react';
import './MochiWizard.scss';
import { Button as MochiButton } from '../Button';

const MochiWizard = ({
  steps = [],
  onComplete,
  onCancel,
  showStepNumbers = true,
  allowSkip = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = async () => {
    if (currentStepData.onNext) {
      const canProceed = await currentStepData.onNext();
      if (canProceed === false) return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (isLastStep) {
      if (onComplete) {
        onComplete();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (allowSkip && currentStepData.skippable !== false) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (index) => {
    if (completedSteps.includes(index) || index < currentStep) {
      setCurrentStep(index);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`mochi-wizard ${className}`}>
      <div className="mochi-wizard-header">
        <div className="mochi-wizard-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`mochi-wizard-step ${index === currentStep ? 'active' : ''} ${
                completedSteps.includes(index) ? 'completed' : ''
              } ${
                completedSteps.includes(index) || index < currentStep ? 'clickable' : ''
              }`}
              onClick={() => handleStepClick(index)}
            >
              <div className="mochi-wizard-step-indicator">
                {completedSteps.includes(index) ? (
                  <span className="mochi-wizard-step-check">✓</span>
                ) : (
                  showStepNumbers && <span>{index + 1}</span>
                )}
              </div>
              <div className="mochi-wizard-step-label">{step.label}</div>
              {index < steps.length - 1 && <div className="mochi-wizard-step-connector" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mochi-wizard-content">
        {currentStepData.title && (
          <h2 className="mochi-wizard-title">{currentStepData.title}</h2>
        )}
        {currentStepData.description && (
          <p className="mochi-wizard-description">{currentStepData.description}</p>
        )}
        <div className="mochi-wizard-body">{currentStepData.content}</div>
      </div>

      <div className="mochi-wizard-actions">
        <div className="mochi-wizard-actions-left">
          {onCancel && (
            <MochiButton variant="secondary" onClick={handleCancel}>
              Cancel
            </MochiButton>
          )}
        </div>
        <div className="mochi-wizard-actions-right">
          {!isFirstStep && (
            <MochiButton variant="secondary" onClick={handleBack}>
              Back
            </MochiButton>
          )}
          {allowSkip && currentStepData.skippable !== false && !isLastStep && (
            <MochiButton variant="secondary" onClick={handleSkip}>
              Skip
            </MochiButton>
          )}
          <MochiButton onClick={handleNext}>
            {isLastStep ? 'Finish' : 'Next'}
          </MochiButton>
        </div>
      </div>
    </div>
  );
};

export default MochiWizard;
