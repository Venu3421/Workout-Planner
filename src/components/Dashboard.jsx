import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

const Dashboard = ({ userData, plan, onTrackProgress }) => {
    const { signOut } = useAuth();
    if (!plan) return null;

    return (
        <div className="dashboard-container animate-fade-in" style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
                <button onClick={signOut} className="btn-logout" style={{ position: 'absolute', right: 0, top: 0 }}>
                    <LogOut size={16} /> <span className="hide-mobile">Sign Out</span>
                </button>
                <h1 style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>Welcome, <span className="gradient-text">{userData.name}</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Your customized roadmap to <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{userData.goal}</span></p>
            </header>

            {/* Top Section: Balanced Two-Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '1.5rem',
                alignItems: 'start'
            }}>
                {/* Left Column: Stacked Stats and Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* User Summary */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '700' }}>Athletic Profile</h3>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <SummaryItem label="Physical Stats" value={`${userData.height}cm / ${userData.weight}kg`} />
                            <SummaryItem label="Current BMI" value={calculateBMI(userData.height, userData.weight)} />
                            <SummaryItem label="Experience" value={userData.fitnessLevel} />
                            <SummaryItem label="Regime Type" value={userData.location} />
                        </div>
                    </div>

                    {/* Tips & Habits */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💡</div>
                            <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: '700' }}>Lifestyle & Budget</h3>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>Value Optimization</h4>
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                {plan.diet.budgetTips.map((tip, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{tip}</li>)}
                            </ul>
                        </div>
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>Core Habits</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {plan.tips.map((tip, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', padding: '5px 12px', background: 'var(--glass)', borderRadius: '30px', border: '1px solid var(--glass-border)', color: 'var(--text-main)', fontWeight: '500' }}>
                                        {tip}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Diet Plan */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(58, 123, 213, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🥗</div>
                        <h3 style={{ color: 'var(--secondary)', fontSize: '1.2rem', fontWeight: '700' }}>Daily Nutrition ({userData.dietType})</h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1.2rem' }}>
                        <MealItem label="Breakfast" value={plan.diet.dailyMeals.breakfast} />
                        <MealItem label="Lunch" value={plan.diet.dailyMeals.lunch} />
                        <MealItem label="Snack" value={plan.diet.dailyMeals.snack} />
                        <MealItem label="Dinner" value={plan.diet.dailyMeals.dinner} />
                    </div>
                    {plan.diet.reasoning && (
                        <div style={{
                            marginTop: '1.8rem',
                            fontSize: '0.85rem',
                            color: 'var(--success)',
                            lineHeight: '1.6',
                            background: 'rgba(16, 185, 129, 0.04)',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(16, 185, 129, 0.12)',
                            boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.02)'
                        }}>
                            <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block', marginBottom: '0.4rem', letterSpacing: '1px' }}>AI Intelligence Insight</span>
                            {plan.diet.reasoning}
                        </div>
                    )}
                </div>
            </div>

            {/* Workout Schedule */}
            <section style={{ marginTop: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Weekly <span className="gradient-text">Efficiency Schedule</span></h2>
                    <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        🚀 {plan.workout.progression}
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem',
                    alignItems: 'stretch' // Ensures cards in the same row have equal height
                }}>
                    {plan.workout.schedule.map((dayPlan, index) => (
                        <div key={index} className="glass-card" style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            borderLeftWidth: dayPlan.exercises.length > 0 ? '4px' : '1px',
                            borderLeftColor: dayPlan.exercises.length > 0 ? 'var(--primary)' : 'var(--glass-border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dim)', letterSpacing: '1px' }}>{dayPlan.day}</span>
                                {dayPlan.exercises.length > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>WORKOUT</span>}
                            </div>
                            <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'white' }}>{dayPlan.activity}</h4>

                            {dayPlan.exercises.length > 0 ? (
                                <ul style={{ fontSize: '0.9rem', color: 'var(--text-dim)', listStyle: 'none' }}>
                                    {dayPlan.exercises.map((ex, i) => <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: 'var(--primary)' }}>•</span> {ex}
                                    </li>)}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', opacity: 0.6, fontStyle: 'italic' }}>Deep recovery and mobility focus.</p>
                            )}

                            {dayPlan.tips && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                                    <span style={{ fontSize: '0.8rem' }}>💡</span>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>{dayPlan.tips}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Progress Trigger */}
            <div style={{ marginTop: '5rem', textAlign: 'center', padding: '4rem 2rem', background: 'radial-gradient(circle at center, rgba(0, 210, 255, 0.1) 0%, transparent 70%)', borderRadius: '40px' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Consistency is Key</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>Log your daily efforts to visualizes your evolution and stay motivated.</p>
                <button className="btn-primary" onClick={onTrackProgress} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Enter Today's Data</button>
            </div>

            <footer style={{ marginTop: '6rem', padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', borderTop: '1px solid var(--glass-border)' }}>
                <p>© {new Date().getFullYear()} AI Human Performance Lab | Student Fitness Project</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.5 }}>Individual results may vary. Consult with health experts before extreme dietary shifts.</p>
            </footer>
        </div>
    );
};

const SummaryItem = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ fontWeight: '600', color: 'white' }}>{value}</span>
    </div>
);

const MealItem = ({ label, value }) => (
    <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.2rem', display: 'block' }}>{label}</span>
        <span style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)', display: 'block' }}>{value}</span>
    </div>
);

const calculateBMI = (h, w) => {
    const bmi = (w / ((h / 100) ** 2)).toFixed(1);
    let category = '';
    if (bmi < 18.5) category = '(Underweight)';
    else if (bmi < 25) category = '(Healthy)';
    else category = '(Overweight)';
    return `${bmi} ${category}`;
};

export default Dashboard;
