import { useState, useEffect } from 'react';
import { userService } from './services/userService';
import './App.css';
import UserInfoCard from './components/UserInfoCard';
import WinLoseBar from './components/WinLoseBar';
import MatchList from './components/MatchList';

function App() {
  const [steamId, setSteamId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [winLose, setWinLose] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 5; // Her sayfada gösterilecek maç sayısı

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserInfo(null);
    setWinLose(null);
    setMatches([]);

    try {
      // Fetch user info
      const userResponse = await userService.getUserInfo(steamId);
      console.log('User Response:', userResponse);
      if (userResponse.error) {
        throw new Error(userResponse.error);
      }
      setUserInfo({ message: userResponse }); // Wrap in message object if not already wrapped

      // Fetch win/lose data
      const winLoseResponse = await userService.getWinLose(steamId);
      console.log('Win/Lose Response:', winLoseResponse);
      if (winLoseResponse.error) {
        throw new Error(winLoseResponse.error);
      }
      setWinLose(winLoseResponse); // Store the whole response

      // Fetch matches
      const matchesResponse = await userService.getMatches(steamId);
      console.log('Raw matches data:', matchesResponse);
      console.log('Matches Response:', matchesResponse);
      if (matchesResponse.error) {
        throw new Error(matchesResponse.error);
      }
      setMatches(Array.isArray(matchesResponse) ? matchesResponse : matchesResponse.message || []);

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

  // Sayfalama için verileri parçalama
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const nextPage = () => {
    if (indexOfLastMatch < matches.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
          placeholder="Enter Steam ID"
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

          {matches && matches.length > 0 && (
            <div>
              <h2>Match History</h2>
              <MatchList matches={currentMatches} />
              
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  ⬅ Previous
                </button>
                <span>
                  Page {currentPage} of {Math.ceil(matches.length / matchesPerPage)}
                </span>
                <button onClick={nextPage} disabled={indexOfLastMatch >= matches.length}>
                  Next ➡
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
