import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/shared';
import homeContent from '../../data/home.json';
import { matchService } from '../../services/match.service';
import { Loader2, Calendar, Trophy, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function MatchesListPage() {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      if (!sessionCode) return;
      try {
        setIsLoading(true);
        const data = await matchService.getMatches(sessionCode);
        
        // Sort matches: Live first, then scheduled, then completed
        const sorted = data.sort((a: any, b: any) => {
          const statusOrder: Record<string, number> = { 'live': 1, 'scheduled': 2, 'completed': 3 };
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        });
        
        setMatches(sorted);
      } catch (err: any) {
        console.error('Failed to load matches', err);
        setError('Failed to load matches for this session.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, [sessionCode]);

  const handleMatchClick = (matchId: number) => {
    navigate(`/match/${matchId}/scorecard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans relative overflow-x-hidden transition-colors">
      <Navbar data={homeContent.navbar} />
      
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-green/10 dark:from-brand-green/5 to-transparent pointer-events-none -z-10" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 pt-32 pb-16 relative z-10 flex flex-col">
        <div className="mb-8 md:mb-12 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
              Session Code: {sessionCode}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Session Matches
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Select a match to view the live scorecard.
          </p>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-brand-green animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-800/30 text-center font-medium shadow-sm">
            {error}
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Matches Yet</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Matches created in this session will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {matches.map((match) => (
              <div 
                key={match.matchId}
                onClick={() => handleMatchClick(match.matchId)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-brand-green/30 dark:hover:border-brand-green/30 transition-all cursor-pointer active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/0 to-brand-green/0 group-hover:from-brand-green/5 group-hover:to-transparent transition-colors opacity-0 group-hover:opacity-100 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    {match.status === 'live' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider border border-red-200 dark:border-red-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Live
                      </span>
                    ) : match.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                        <Trophy className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800/50">
                        <Clock className="w-3 h-3" />
                        Scheduled
                      </span>
                    )}
                  </div>
                  
                  {match.startedAt && (
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(match.startedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px] capitalize">
                      {match.teamA?.teamName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">VS</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px] text-right capitalize">
                      {match.teamB?.teamName}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-center">
                    {match.status === 'completed' && match.winnerTeamId ? (
                      <span className="text-brand-primary font-bold capitalize">
                        {match.winnerTeam?.teamName} won by {match.winMargin}
                      </span>
                    ) : match.status === 'completed' && !match.winnerTeamId ? (
                      <span>Match Tied</span>
                    ) : match.tossWinnerTeamId ? (
                      <span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{match.tossWinnerTeam?.teamName}</span> won toss, <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{match.tossDecision}</span>
                      </span>
                    ) : (
                      <span>Toss yet to happen</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
