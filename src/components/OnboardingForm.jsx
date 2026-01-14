import React, { useState } from 'react';
import { generatePlan } from '../utils/PlanGenerator';

const OnboardingForm = ({ onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        height: '',
        weight: '',
        fitnessLevel: 'Beginner',
        goal: 'General fitness',
        location: 'home',
        budget: 'medium',
        dietType: 'Vegetarian',
        region: 'North Indian',
        allergies: ''
    });

    const [generating, setGenerating] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const plan = await generatePlan(formData);
            onSubmit(formData, plan);
        } catch (error) {
            console.error("Submission error:", error);
            // Handle error (maybe show an alert)
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="onboarding-container animate-fade-in" style={{ padding: '4rem 2rem' }}>
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Step {step} of 4</h2>
                <div style={{ height: '4px', background: 'var(--glass)', borderRadius: '2px', marginBottom: '2.5rem' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', width: `${(step / 4) * 100}%`, borderRadius: '2px', transition: 'var(--transition)' }}></div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="form-step" key="step1">
                            <h3 style={{ marginBottom: '1.5rem' }}>Personal Details</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <input required type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={inputStyle} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input required type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} style={inputStyle} />
                                    <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input required type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} style={inputStyle} />
                                    <input required type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="form-step" key="step2">
                            <h3 style={{ marginBottom: '1.5rem' }}>Fitness Goals</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} style={inputStyle}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                <select name="goal" value={formData.goal} onChange={handleChange} style={inputStyle}>
                                    <option value="Fat loss">Fat Loss</option>
                                    <option value="Muscle gain">Muscle Gain</option>
                                    <option value="Weight maintenance">Weight Maintenance</option>
                                    <option value="General fitness">General Fitness</option>
                                    <option value="Endurance">Endurance</option>
                                </select>
                                <select name="location" value={formData.location} onChange={handleChange} style={inputStyle}>
                                    <option value="home">Home (Bodyweight)</option>
                                    <option value="hostel">Hostel (Limited Space)</option>
                                    <option value="gym">Gym (Full Equipment)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form-step" key="step3">
                            <h3 style={{ marginBottom: '1.5rem' }}>Dietary Preferences</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <select name="dietType" value={formData.dietType} onChange={handleChange} style={inputStyle}>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Eggetarian">Eggetarian</option>
                                </select>
                                <select name="region" value={formData.region} onChange={handleChange} style={inputStyle}>
                                    <option value="North Indian">North Indian</option>
                                    <option value="South Indian">South Indian</option>
                                    <option value="Regional">Regional / Global</option>
                                </select>
                                <input type="text" name="allergies" placeholder="Allergies (if any)" value={formData.allergies} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="form-step" key="step4">
                            <h3 style={{ marginBottom: '1.5rem' }}>Lifestyle & Budget</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <select name="budget" value={formData.budget} onChange={handleChange} style={inputStyle}>
                                    <option value="low">Low Budget (Student Friendly)</option>
                                    <option value="medium">Medium Budget</option>
                                    <option value="high">Flexible Budget</option>
                                </select>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    By clicking "Generate Plan", our AI coach will create a custom routine based on your data.
                                </p>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                        {step > 1 && (
                            <button type="button" className="btn-secondary" onClick={(e) => { e.preventDefault(); prevStep(); }}>Back</button>
                        )}
                        {step < 4 ? (
                            <button type="button" className="btn-primary" onClick={(e) => { e.preventDefault(); nextStep(); }} style={{ marginLeft: 'auto' }}>Next</button>
                        ) : (
                            <button type="submit" className="btn-primary" style={{ marginLeft: 'auto' }} disabled={generating}>
                                {generating ? 'Generating Plan...' : 'Generate Plan'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '1rem',
    background: 'var(--bg-dark)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'var(--text-main)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'var(--transition)',
    cursor: 'pointer'
};

export default OnboardingForm;
