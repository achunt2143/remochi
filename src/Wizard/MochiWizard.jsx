// MochiWizard.jsx
import React, { useRef, useState } from 'react';
import './MochiWizard.scss';
import { Button as MochiButton } from '../Button';

const sameSteps = (a, b) => a.length === b.length && a.every((s) => b.includes(s));

/**
 * Completion tracking works like a stack by default: Next marks the step
 * being left as completed, and going back (Back, or tapping an earlier
 * step) un-completes the step returned to and everything after it, since
 * those steps are being redone.
 *
 * Pass `completedSteps` to manage completion yourself. The wizard then only
 * displays that list, and onCompletedStepsChange reports what its default
 * tracking would have changed it to, so the app can take, adjust or ignore
 * it. Same controlled/uncontrolled split as RepanelStack's activeIndex.
 */
const MochiWizard = ({
  steps = [],
  onComplete,
  onCancel,
  onStepChange,
  completedSteps: completedStepsProp,
  onCompletedStepsChange,
  showStepNumbers = true,
  allowSkip = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [trackedSteps, setTrackedSteps] = useState([]);
  const isCompletionControlled = completedStepsProp != null;
  const completedSteps = isCompletionControlled ? completedStepsProp : trackedSteps;
  // Ignores a second Next while an async step.onNext is still pending,
  // which would otherwise advance (and mark completed) twice.
  const advancingRef = useRef(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const commitCompleted = (next, reason, to) => {
    if (sameSteps(next, completedSteps)) return;
    if (!isCompletionControlled) setTrackedSteps(next);
    onCompletedStepsChange?.(next, { reason, from: currentStep, to });
  };

  const goTo = (index, reason) => {
    setCurrentStep(index);
    onStepChange?.(index, { reason, from: currentStep, to: index });
  };

  const handleNext = async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    try {
      if (currentStepData.onNext) {
        const canProceed = await currentStepData.onNext();
        if (canProceed === false) return;
      }

      if (isLastStep) {
        commitCompleted([...completedSteps, currentStep], 'finish', currentStep);
        onComplete?.();
      } else {
        commitCompleted([...completedSteps, currentStep], 'next', currentStep + 1);
        goTo(currentStep + 1, 'next');
      }
    } finally {
      advancingRef.current = false;
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    const target = currentStep - 1;
    commitCompleted(completedSteps.filter((s) => s < target), 'back', target);
    goTo(target, 'back');
  };

  const handleSkip = () => {
    if (allowSkip && currentStepData.skippable !== false) {
      goTo(currentStep + 1, 'skip');
    }
  };

  const isStepClickable = (index) =>
    index !== currentStep && (index < currentStep || completedSteps.includes(index));

  const handleStepClick = (index) => {
    if (!isStepClickable(index)) return;
    if (index < currentStep) {
      commitCompleted(completedSteps.filter((s) => s < index), 'jump', index);
    }
    // A completed step ahead of the current one only exists when the app
    // supplies completedSteps; jumping forward to it leaves completion as is.
    goTo(index, 'jump');
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
              } ${isStepClickable(index) ? 'clickable' : ''}`}
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
            <MochiButton onClick={handleCancel}>
              Cancel
            </MochiButton>
          )}
        </div>
        <div className="mochi-wizard-actions-right">
          {!isFirstStep && (
            <MochiButton onClick={handleBack}>
              Back
            </MochiButton>
          )}
          {allowSkip && currentStepData.skippable !== false && !isLastStep && (
            <MochiButton onClick={handleSkip}>
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
