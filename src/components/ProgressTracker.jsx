import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';

const ProgressTracker = ({ userData }) => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [weight, setWeight] = useState(userData?.weight || 0);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user]);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('progress_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true });

        if (data) setLogs(data);
        setLoading(false);
    };

    const addLog = async () => {
        if (!user) return alert('Please sign in to save progress');

        const newLog = {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(weight),
            completed: completed
        };

        const { error } = await supabase.from('progress_logs').upsert(newLog);

        if (!error) {
            fetchLogs();
            setCompleted(false);
        }
    };

    const chartData = logs.map(log => ({
        name: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        weight: log.weight
    }));

    return (
        <div className="progress-container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card">
                <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target color="var(--primary)" /> Track Your <span className="gradient-text">Progress</span>
                </h2>

                {/* Chart Section */}
                {logs.length > 1 && (
                    <div style={{ height: '350px', marginBottom: '3rem', background: 'var(--glass)', padding: '1.5rem', borderRadius: '16px', minWidth: 0 }}>
                        <h4 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={18} color="var(--secondary)" /> Weight Trend (kg)
                        </h4>
                        <ResponsiveContainer width="99%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--text-dim)"
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <YAxis
                                    stroke="var(--text-dim)"
                                    fontSize={12}
                                    domain={['dataMin - 2', 'dataMax + 2']}
                                    tickMargin={10}
                                />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)' }}
                                    itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--bg-dark)' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Current Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="checkbox"
                            id="workoutDone"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                        />
                        <label htmlFor="workoutDone" style={{ cursor: 'pointer' }}>Workout Completed Today?</label>
                    </div>
                    <button className="btn-primary" onClick={addLog} style={{ minWidth: '150px' }}>Log Entry</button>
                </div>

                <div className="history">
                    <h3 style={{ marginBottom: '1rem' }}>Log History</h3>
                    {logs.length === 0 ? (
                        <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No logs yet. Start tracking today!</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {logs.map((log, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: 'var(--glass)',
                                    borderRadius: '12px',
                                    borderLeft: `4px solid ${log.completed ? 'var(--success)' : 'var(--accent)'}`
                                }}>
                                    <span>{log.date}</span>
                                    <span><strong>{log.weight} kg</strong></span>
                                    <span style={{ color: log.completed ? 'var(--success)' : 'var(--text-dim)' }}>
                                        {log.completed ? '✓ Completed' : '✕ Missed'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '1rem',
    background: 'var(--glass)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
};

export default ProgressTracker;
