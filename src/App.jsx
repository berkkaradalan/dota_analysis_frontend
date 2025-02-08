import { useState } from 'react';
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

    try {
      const [userInfoData, winLoseData, matchesData] = await Promise.all([
        userService.getUserInfo(steamId),
        userService.getWinLose(steamId),
        userService.getMatches(steamId),
      ]);

      console.log("User Info:", userInfoData);
      console.log("Win/Lose:", winLoseData);
      console.log("Matches Data:", matchesData);

      setUserInfo(userInfoData);
      setWinLose(winLoseData);
      setMatches(matchesData.message || []); // matchesData.message dizisini aldığımızdan emin ol
      setCurrentPage(1); // Yeni aramada sayfayı sıfırla
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      {error && <div className="error">{error}</div>}

      {userInfo && (
        <div className="results">
          <UserInfoCard userInfo={userInfo} />

          {winLose && (
            <div>
              <WinLoseBar win={winLose.message.Win} lose={winLose.message.Lose} />
            </div>
          )}

          {matches.length > 0 && (
            <div>
              <h2>Match History</h2>
              <MatchList matches={currentMatches} />
              
              {/* Sayfalama Kontrolleri */}
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
