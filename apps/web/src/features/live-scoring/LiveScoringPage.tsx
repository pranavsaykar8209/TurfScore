import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LiveScoringBoard, MatchNotFound, MatchLoadError } from './components';
import { matchService } from '../../services/match.service';
import { Loader2 } from 'lucide-react';

export default function LiveScoringPage() {
  const { sessionCode, matchId } = useParams<{ sessionCode: string, matchId: string }>();
  const location = useLocation();
  const routeState = location.state;

  const [isLoading, setIsLoading] = useState(!routeState);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!sessionCode || !matchId) return;
      try {
        setIsLoading(true);
        
        // Single API call that fetches all necessary hydration data
        const liveData = await matchService.getLiveScoringData(parseInt(matchId));

        setData({
          ...liveData,
          matchId: parseInt(matchId),
          initialInningsData: liveData.currentInningsData
        });

      } catch (err: any) {
        console.error('Failed to load match data', err);
        if (err.response?.status === 404 || err.response?.data?.error === 'Match not found') {
          setError('NOT_FOUND');
        } else {
          setError('Failed to load match data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionCode, matchId, routeState]);

  if (error === 'NOT_FOUND') {
    return <MatchNotFound />;
  }

  if (error) {
    return <MatchLoadError error={error} />;
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return <LiveScoringBoard {...data} />;
}
