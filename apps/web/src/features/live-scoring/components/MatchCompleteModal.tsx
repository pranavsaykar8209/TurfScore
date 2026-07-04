import { MatchState } from '../types';

interface MatchCompleteModalProps {
  matchState: MatchState;
  battingTeamName: string;
  bowlingTeamName: string;
  onViewDashboard: () => void;
}

export default function MatchCompleteModal({
  matchState,
  battingTeamName,
  bowlingTeamName,
  onViewDashboard,
}: MatchCompleteModalProps) {
  let winnerText = '';
  let subText = '';

  if (matchState.matchWinner === 'BATTING_TEAM') {
    winnerText = `${battingTeamName} Won!`;
    subText = `Won by ${matchState.winMargin}`;
  } else if (matchState.matchWinner === 'BOWLING_TEAM') {
    winnerText = `${bowlingTeamName} Won!`;
    subText = `Won by ${matchState.winMargin}`;
  } else if (matchState.matchWinner === 'TIE') {
    winnerText = "Match Tied!";
    subText = "Scores are level";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md animate-in fade-in zoom-in duration-200 text-center">
        <h2 className="text-3xl font-black text-brand-primary mb-2 uppercase tracking-wide">
          {winnerText}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
          {subText}
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <div className={`rounded-2xl p-4 flex justify-between items-center border transition-colors ${
            matchState.matchWinner === 'BOWLING_TEAM'
              ? 'bg-brand-green/10 border-brand-green ring-1 ring-brand-green'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
          }`}>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold text-slate-500">Team 1</span>
                {matchState.matchWinner === 'BOWLING_TEAM' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-green text-brand-dark px-2 py-0.5 rounded-full">
                    Winner
                  </span>
                )}
              </div>
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {matchState.firstInningsScore ? bowlingTeamName : battingTeamName} {/* Assuming team 1 batted first if firstInningsScore exists */}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {matchState.firstInningsScore?.runs || 0}/{matchState.firstInningsScore?.wickets || 0}
              </span>
              <div className="text-xs text-slate-500 font-medium">
                ({matchState.firstInningsScore?.overs || 0}.{matchState.firstInningsScore?.overDeliveries || 0} OV)
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-4 flex justify-between items-center border transition-colors ${
            matchState.matchWinner === 'BATTING_TEAM'
              ? 'bg-brand-green/10 border-brand-green ring-1 ring-brand-green'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
          }`}>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold text-slate-500">Team 2</span>
                {matchState.matchWinner === 'BATTING_TEAM' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-green text-brand-dark px-2 py-0.5 rounded-full">
                    Winner
                  </span>
                )}
              </div>
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {matchState.firstInningsScore ? battingTeamName : bowlingTeamName} {/* Second batting team */}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {matchState.totalRuns}/{matchState.totalWickets}
              </span>
              <div className="text-xs text-slate-500 font-medium">
                ({matchState.currentOver}.{matchState.currentBall} OV)
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onViewDashboard}
          className="w-full rounded-2xl h-14 font-bold uppercase text-sm tracking-wider shadow-lg transition-all bg-brand-green text-brand-dark hover:bg-brand-green/90 active:scale-95 mb-3"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}
