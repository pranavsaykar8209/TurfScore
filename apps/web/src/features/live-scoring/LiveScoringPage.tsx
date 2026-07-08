import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LiveScoringBoard } from './components';
import { matchService } from '../../services/match.service';
import { sessionService } from '../../services/session.service';
import { inningsService } from '../../services/innings.service';
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

      } catch (err) {
        console.error('Failed to load match data', err);
        setError('Failed to load match data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionCode, matchId, routeState]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
           <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
           <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
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
