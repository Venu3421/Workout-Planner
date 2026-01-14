import React, { useState, useEffect } from 'react';
import './index.css';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import ProgressTracker from './components/ProgressTracker';
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabaseClient';

function App() {
  const { user, signInWithGoogle, signInWithGitHub, signOut } = useAuth();
  const [view, setView] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setView('landing');
      setUserData(null);
      setPlan(null);
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data && data.plan_config) {
      setUserData(data.user_details);
      setPlan(data.plan_config);
      setView('dashboard');
    }
    setLoading(false);
  };

  const handleFormSubmit = async (data, generatedPlan) => {
    setUserData(data);
    setPlan(generatedPlan);

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        user_details: data,
        plan_config: generatedPlan,
        updated_at: new Date()
      });
    }
    setView('dashboard');
  };

  return (
    <div className="app-container">
      {view === 'landing' && (
        <div className="landing-page animate-fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            Elevate Your <span className="gradient-text">Fitness Journey</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
            Personalized workout and nutrition plans tailored specifically for student life.
            Practical, affordable, and culturally aware.
          </p>

          {!user ? (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={signInWithGoogle}>
                Sign In with Google
              </button>
              <button className="btn-secondary" onClick={signInWithGitHub}>
                Sign In with GitHub
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" onClick={() => setView('onboarding')}>
                {plan ? 'Reset Plan' : 'Start Your Transformation'}
              </button>
              {plan && (
                <button className="btn-secondary" onClick={() => setView('dashboard')}>
                  View Your Plan
                </button>
              )}
            </div>
          )}

          {user && (
            <button onClick={signOut} style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', textDecoration: 'underline' }}>
              Sign Out
            </button>
          )}
        </div>
      )}

      {view === 'onboarding' && (
        <OnboardingForm onSubmit={handleFormSubmit} />
      )}

      {view === 'dashboard' && (
        <Dashboard userData={userData} plan={plan} onTrackProgress={() => setView('progress')} />
      )}

      {view === 'progress' && (
        <>
          <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)' }}>
            <button className="btn-secondary" onClick={() => setView('dashboard')}>Back to Dashboard</button>
          </nav>
          <ProgressTracker userData={userData} />
        </>
      )}
    </div>
  );
}

export default App;
