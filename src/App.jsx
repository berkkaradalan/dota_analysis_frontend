import { useState, useEffect } from 'react';
import { userService } from './services/userService';
import './App.css';
import UserInfoCard from './components/UserInfoCard';
import WinLoseBar from './components/WinLoseBar';
import MatchList from './components/MatchList';
import FavoriteHeroes from './components/FavoriteHeroes';

function App() {
  const [steamId, setSteamId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [winLose, setWinLose] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 5; // Her sayfada gösterilecek maç sayısı
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserInfo(null);
    setWinLose(null);
    setMatches([]);
    setCurrentPage(1);
    setHasMore(true);

    try {
      // Fetch user info
      const userResponse = await userService.getUserInfo(steamId);
      if (userResponse.error) {
        throw new Error(userResponse.error);
      }
      setUserInfo(userResponse.message || userResponse);

      // Fetch win/lose data
      const winLoseResponse = await userService.getWinLose(steamId);
      if (winLoseResponse.error) {
        throw new Error(winLoseResponse.error);
      }
      setWinLose(winLoseResponse); // Store the whole response

      // Fetch first page of matches
      const matchesResponse = await userService.getMatches(steamId, matchesPerPage, 1);
      if (matchesResponse.error) {
        throw new Error(matchesResponse.error);
      }
      const matchList = matchesResponse.message || [];
      setMatches(matchList);
      setHasMore(matchList.length === matchesPerPage);

    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add this debug logging
  useEffect(() => {
    console.log('Current state:', {
      userInfo,
      winLose,
      matches,
      loading,
      error
    });
  }, [userInfo, winLose, matches, loading, error]);

  // Add loadMoreMatches function
  const loadMoreMatches = async () => {
    try {
      const nextPage = currentPage + 1;
      const newMatches = await userService.getMatches(steamId, matchesPerPage, nextPage);
      
      if (newMatches.error) throw new Error(newMatches.error);
      
      const matchList = newMatches.message || [];
      if (matchList.length === 0) {
        setHasMore(false);
        return;
      }

      setMatches(prevMatches => [...prevMatches, ...matchList]);
      setCurrentPage(nextPage);
      setHasMore(matchList.length === matchesPerPage);
    } catch (err) {
      setError(err.message || 'Error loading more matches');
      console.error('Error:', err);
    }
  };

  return (
    <div className="container">
      <h1 className="header-title">
        <img
          src="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/dota_footer_logo.png"
          alt="Dota Logo"
          className="dota-logo"
        />
      </h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          placeholder={import.meta.env.VITE_API_BASE_URL}
          // placeholder="Enter Steam ID"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <div className="loading">Fetching user data...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && userInfo && (
        <div className="results">
          <UserInfoCard userInfo={userInfo} />

          {winLose && (
            <div>
              <WinLoseBar 
                win={winLose.Win || winLose.message?.Win} 
                lose={winLose.Lose || winLose.message?.Lose} 
              />
            </div>
          )}

          <FavoriteHeroes steamId={steamId} />

          {matches && matches.length > 0 && (
            <div>
              <h2>Match History</h2>
              <MatchList matches={matches} steamId={steamId} />
              
              <div className="pagination">
                {hasMore && (
                  <button 
                    onClick={loadMoreMatches} 
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More Matches'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
