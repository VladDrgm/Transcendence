import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../div/Pagination';
import { MatchHistoryItem } from '../../interfaces/MatchHistory';
import { UsernameItem } from '../../interfaces/UsernameList';
import { getGlobalMatchHistory, getPersonalMatchHistory } from '../../api/matchHistory.api';
import { getUserList } from '../../api/user_list.api';
import { useUserContext } from '../context/UserContext';
import { ButtonStyle, MatchHistoryCard, MatchHistoryScore, MatchHistoryTitle, MatchHistoryWinner } from './MatchHistoryStyles';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

const ITEMS_PER_PAGE = 15;

interface MatchHistoryProps {
  userID: number | undefined;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const MatchHistoryMainDiv: React.FC<MatchHistoryProps> = ({ userID, friend_set }) => {
  const [matchData, setMatchData] = useState<MatchHistoryItem[]>([]);
  const [usernameList, setusernameList] = useState<UsernameItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showPersonalMatches, setShowPersonalMatches] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const getData = async () => {
    const usenames = await getUserList();
    setusernameList(usenames);

    try {
      const data = showPersonalMatches
        ? await getPersonalMatchHistory(userID as number, user?.intraUsername, user?.passwordHash)
        : await getGlobalMatchHistory(userID as number, user?.intraUsername, user?.passwordHash);

      setMatchData(data);
    } catch (error) {
      setMatchData([]);
    }

    setCurrentPage(1);
  };

  useEffect(() => {
    getData();
  }, [showPersonalMatches]);

  useEffect(() => {
	// Check if the user is logged in when the component mounts
	if (!user) {
		navigate('/login'); // Redirect to the login page if not logged in
	}
    postUserStatus("Online", user!);
  }, [navigate]);

  const openFriend = (FID: number) => {
    friend_set(FID);
  };

  const findUsername = (idToFind: number): string | undefined => {
    return usernameList.find((user) => user.id === idToFind)?.username;
  };

  const filteredData = matchData;

  // Split the data into multiple pages
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  var startIdx;
  var endIdx;
  var currentPageData: MatchHistoryItem[];
  if (totalPages === 0) {
    startIdx = 0;
    endIdx = 0;
    currentPageData = [];
  } else {
    startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    endIdx = startIdx + ITEMS_PER_PAGE;
    try {
      currentPageData = filteredData.slice(startIdx, endIdx);
    } catch (error) {
      currentPageData = [];
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <button style={ButtonStyle} onClick={() => setShowPersonalMatches(!showPersonalMatches)}>
        {showPersonalMatches ? 'Show All Matches' : 'Show My Matches'}
      </button>
      {currentPageData.map((item) => (
        <MatchHistoryCard key={item.MatchId}>
          <div>
            <p style={MatchHistoryTitle}>
              {item.Player1Id === userID ? (
                <Link to={'/app/profile'} style={{ ...MatchHistoryTitle, textDecoration: 'none' }}>
                  {findUsername(item.Player1Id)}
                </Link>
              ) : (
                <Link
                  onClick={() => openFriend(item.Player1Id)}
                  to={`/app/public_profile/${item.Player1Id}`}
                  style={{ ...MatchHistoryTitle, textDecoration: 'none' }}
                >
                  {findUsername(item.Player1Id)}
                </Link>
              )}{' '}
              <span style={{ color: '#0071BB' }}> vs </span>
              {item.Player2Id === userID ? (
                <Link to={'/app/profile'} style={{ ...MatchHistoryTitle, textDecoration: 'none' }}>
                  {findUsername(item.Player2Id)}
                </Link>
              ) : (
                <Link
                  onClick={() => openFriend(item.Player2Id)}
                  to={`/app/public_profile/${item.Player2Id}`}
                  style={{ ...MatchHistoryTitle, textDecoration: 'none' }}
                >
                  {findUsername(item.Player2Id)}
                </Link>
              )}
            </p>
          </div>

          <p style={MatchHistoryScore}>
            Score: {item.Player1Points} - {item.Player2Points}
          </p>
          <p style={MatchHistoryWinner}>
          {item.WinnerId !== 0 ? (
            <>
              Winner: {findUsername(item.WinnerId)}{" "}
              {item.WinningCondition === "disconnected" && (
                <span>(game {item.WinningCondition})</span>
              )}
            </>
          ) : (
            <>
              No winner. No losers{" "}
              {item.WinningCondition === "disconnected" && (
                <span>(game {item.WinningCondition})</span>
              )}
            </>
          )}
        </p>
        </MatchHistoryCard>
      ))}
      {totalPages > 0 && (
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default MatchHistoryMainDiv;
