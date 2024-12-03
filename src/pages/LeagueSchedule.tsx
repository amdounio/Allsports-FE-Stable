import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, subDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Match } from '../types';
import { getFixtures, generateMatchVisuals, saveToMediaLibrary, getUserGeneratedImagesCount } from '../services/api';
import MatchSchedule from '../components/MatchSchedule';
import BackgroundSelector from '../components/BackgroundSelector';
import TypographySelector from '../components/TypographySelector';
import LeagueShortcuts from '../components/LeagueShortcuts';
import MatchVisual from '../components/MatchVisual';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const LeagueSchedule = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showTypographySelector, setShowTypographySelector] = useState(false);
  const [background, setBackground] = useState('');
  const [typography, setTypography] = useState('font-montserrat');
  const [generatedVisuals, setGeneratedVisuals] = useState<{ [key: string]: { story: string; square: string; view: string } }>({});
  const [generatingMatchId, setGeneratingMatchId] = useState<string | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);

  useEffect(() => {
    const fetchGeneratedCount = async () => {
      if (user?.id) {
        const count = await getUserGeneratedImagesCount(user.id);
        setGeneratedCount(count.generatedImagesCount);
      }
    };

    fetchGeneratedCount();
  }, [user?.id]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!leagueId) return;

      try {
        setLoading(true);
        const data = await getFixtures(parseInt(leagueId), new Date().getFullYear(), currentDate);
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [leagueId, currentDate]);

  const handleMatchSelect = async (matchId: string) => {
    if (!user?.id) {
      toast.error('Please login to generate visuals');
      return;
    }

    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const isSelected = selectedMatches.some(m => m.id === matchId);
    
    if (isSelected) {
      setSelectedMatches(prev => prev.filter(m => m.id !== matchId));
      setGeneratedVisuals(prev => {
        const { [matchId]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    // Check for free plan limits
    const freePlanLimit = Number(import.meta.env.VITE_FREE_PLAN_LIMIT) || 3;
    if (user.plan === 'Free' && generatedCount >= freePlanLimit) {
      toast.error('You have reached your monthly limit. Please upgrade your plan to generate more visuals.');
      return;
    }

    try {
      setGeneratingMatchId(matchId);
      setSelectedMatches(prev => [...prev, match]);

      const visuals = await generateMatchVisuals({
        ...match,
        typography,
        background
      });

      setGeneratedVisuals(prev => ({
        ...prev,
        [matchId]: visuals
      }));

      // Update generated count
      setGeneratedCount(prev => prev + 1);
    } catch (error) {
      console.error('Error generating visuals:', error);
      toast.error('Failed to generate visuals. Please try again.');
      setSelectedMatches(prev => prev.filter(m => m.id !== matchId));
    } finally {
      setGeneratingMatchId(null);
    }
  };

  const handleBackgroundSelect = async (selectedBackground: string) => {
    setBackground(selectedBackground);
    
    if (selectedMatches.length > 0) {
      try {
        setGenerating(true);
        const newVisuals: { [key: string]: { story: string; square: string; view: string } } = {};

        for (const match of selectedMatches) {
          const visuals = await generateMatchVisuals({
            ...match,
            typography,
            background: selectedBackground
          });
          newVisuals[match.id] = visuals;
        }

        setGeneratedVisuals(newVisuals);
      } catch (error) {
        console.error('Error regenerating visuals:', error);
        toast.error('Failed to update visuals with new background');
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleTypographySelect = async (selectedTypography: string) => {
    setTypography(selectedTypography);
    
    if (selectedMatches.length > 0) {
      try {
        setGenerating(true);
        const newVisuals: { [key: string]: { story: string; square: string; view: string } } = {};

        for (const match of selectedMatches) {
          const visuals = await generateMatchVisuals({
            ...match,
            typography: selectedTypography,
            background
          });
          newVisuals[match.id] = visuals;
        }

        setGeneratedVisuals(newVisuals);
      } catch (error) {
        console.error('Error regenerating visuals:', error);
        toast.error('Failed to update visuals with new typography');
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleSaveToLibrary = async () => {
    if (!user?.id) {
      toast.error('Please login to save matches');
      return;
    }

    if (selectedMatches.length === 0) {
      toast.error('Please select at least one match');
      return;
    }

    try {
      setSaving(true);
      const matchesData = selectedMatches.map(match => ({
        match: {
          id: match.id,
          periods: match.periods,
          status: match.status,
          address: match.address,
          firstTeam: match.firstTeam || {
            id: 0,
            name: match.homeTeam,
            logo: match.homeTeamLogo
          },
          secondTeam: match.secondTeam || {
            id: 0,
            name: match.awayTeam,
            logo: match.awayTeamLogo
          },
          startDate: match.startDate,
          endDate: match.endDate,
          championship: match.championship || {}
        },
        date: new Date().toISOString(),
        ...generatedVisuals[match.id]
      }));

      await saveToMediaLibrary(matchesData, user.id);
      toast.success('Saved to library');
      navigate('/mediatheque');
    } catch (error) {
      console.error('Error saving to library:', error);
      toast.error('Failed to save to library');
    } finally {
      setSaving(false);
    }
  };

  const handlePreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-light tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {matches[0]?.championship?.name || 'MATCHES'}
            </h1>
            <p className="text-sm text-zinc-400 tracking-wider">SELECT YOUR MATCHES</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Back
          </button>
        </div>

        {/* League Shortcuts */}
        <LeagueShortcuts currentLeagueId={leagueId} />

        {/* Match Schedule */}
        <MatchSchedule
          matches={matches}
          selectedMatches={selectedMatches.map(m => m.id)}
          onMatchSelect={handleMatchSelect}
          loading={loading}
          currentDate={currentDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          generatedCount={generatedCount}
        />

        {/* Visuals Section */}
        <div className={`rounded-[30px] ${isDark ? 'bg-zinc-900/30' : 'bg-white'} p-8 space-y-6`}>
          <div>
            <h2 className={`text-2xl font-light tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              VISUELS
            </h2>
            <p className="text-sm text-zinc-400 tracking-wider">CUSTOM YOUR POSTERS</p>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/30">
            <div className="flex gap-8 min-w-min">
              {selectedMatches.map((match) => (
                <div key={match.id} className="flex-none w-[400px]">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="aspect-[9/16] w-full">
                      <MatchVisual 
                        match={match} 
                        variant="story"
                        typography={typography}
                        background={background}
                        generatedVisuals={generatedVisuals[match.id]}
                        isGenerating={generatingMatchId === match.id || generating}
                      />
                    </div>
                    <div className="aspect-square w-full">
                      <MatchVisual 
                        match={match} 
                        variant="square"
                        typography={typography}
                        background={background}
                        generatedVisuals={generatedVisuals[match.id]}
                        isGenerating={generatingMatchId === match.id || generating}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {selectedMatches.length === 0 && (
                <div className="w-full flex items-center justify-center h-[500px] text-zinc-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">Select matches to generate visuals</p>
                    <p className="text-sm">Choose from the matches above to create your visuals</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setShowBackgroundSelector(true)}
                className={`px-6 py-2 ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'} rounded-full text-sm transition-colors`}
              >
                Background change
              </button>
              <button
                onClick={() => setShowTypographySelector(true)}
                className={`px-6 py-2 ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'} rounded-full text-sm transition-colors`}
              >
                Change typography
              </button>
            </div>
            <button
              onClick={handleSaveToLibrary}
              disabled={saving || selectedMatches.length === 0}
              className={`px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-100 transition-colors ${
                (saving || selectedMatches.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save to library'
              )}
            </button>
          </div>
        </div>

        {/* Selectors */}
        <BackgroundSelector
          isOpen={showBackgroundSelector}
          onClose={() => setShowBackgroundSelector(false)}
          onSelect={handleBackgroundSelect}
        />
        <TypographySelector
          isOpen={showTypographySelector}
          onClose={() => setShowTypographySelector(false)}
          onSelect={handleTypographySelect}
        />
      </div>
    </div>
  );
};

export default LeagueSchedule;