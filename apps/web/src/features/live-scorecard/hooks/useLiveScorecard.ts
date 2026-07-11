import { useState, useEffect } from 'react';
import { matchService } from '../../../services/match.service';
import { playerStatsService } from '../../../services/player-stats.service';

export function useLiveScorecard(matchId: number | null) {
  const [liveData, setLiveData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScorecard = async () => {
      if (!matchId) return;

      try {
        setIsLoading(true);
        setError('');

        // Fetch both live state (which gives us current over, toss, teams) and full scorecard stats
        const [live, stats] = await Promise.all([
          matchService.getLiveScoringData(matchId),
          playerStatsService.getMatchScorecard(matchId)
        ]);

        setLiveData(live);
        setStatsData(stats);
      } catch (err: any) {
        console.error('Failed to load scorecard data', err);
        if (err.response?.status === 404 || err.response?.data?.error === 'Match not found') {
          setError('NOT_FOUND');
        } else {
          setError('Failed to load match scorecard');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchScorecard();
    
    // Optional: Setup a polling interval for live matches if needed
    // const interval = setInterval(fetchScorecard, 10000);
    // return () => clearInterval(interval);
  }, [matchId]);

  return {
    liveData,
    statsData,
    isLoading,
    error,
  };
}
