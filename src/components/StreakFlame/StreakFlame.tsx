import { getStreakLevel } from '../../utils/streak';
import './StreakFlame.css';

interface Props {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function StreakFlame({ streak, size = 'md', showCount = true }: Props) {
  const level = getStreakLevel(streak);

  const emoji = streak === 0 ? '🩶' : '🔥';

  return (
    <span className={`streak-flame streak-flame--${level} streak-flame--${size}`}>
      <span className="streak-flame__icon">{emoji}</span>
      {showCount && streak > 0 && (
        <span className="streak-flame__count">{streak}</span>
      )}
      {level === 'high' && (
        <>
          <span className="streak-flame__particle">✨</span>
          <span className="streak-flame__particle streak-flame__particle--2">⭐</span>
        </>
      )}
    </span>
  );
}
