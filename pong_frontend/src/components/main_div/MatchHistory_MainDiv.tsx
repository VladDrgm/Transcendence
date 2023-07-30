import React, { useEffect, useState } from 'react';
import Pagination from '../div/pagination';
import { MatchHistoryItem } from '../../interfaces/matchHistory.interface';
import { getGlobalMatchHistory, getPersonalMatchHistory } from '../../api/matchHistory.api';

const ITEMS_PER_PAGE = 3;


enum matchHistoryType_t {
    PERSONAL = 0,
    GLOBAL = 1,
  }

interface MatchHistoryProps
{
  userID: number;
}

const MatchHistory_MainDiv: React.FC<MatchHistoryProps>  = ({userID}) => {
  const [jsonData, setJsonData] = useState<MatchHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyType, setHistoryType]  = useState<number>(matchHistoryType_t.GLOBAL);

  const getData = async () => {
    if (historyType === matchHistoryType_t.PERSONAL)
    {
        const matchData = await getPersonalMatchHistory(userID);
        if (matchData.length === 0)
        {
          setJsonData([]);
        }
        else
        {
          setJsonData(matchData);
        }
    }
    else if (historyType === matchHistoryType_t.GLOBAL)
    {
        const matchData = await getGlobalMatchHistory();
        if (matchData.length === 0)
        {
          setJsonData([]);
        }
        else
        {
          setJsonData(matchData);
        }
    }
    else
    {
        setJsonData([]);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    getData();
  }, [historyType]);

  // Split the data into multiple pages
  const totalPages = Math.ceil(jsonData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentPageData = jsonData.slice(startIdx, endIdx);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <button onClick={() => setHistoryType(matchHistoryType_t.PERSONAL)}>1 v 1</button>
      <button onClick={() => setHistoryType(matchHistoryType_t.GLOBAL)}>Global</button>
      {currentPageData.map((item) => (
        <div key={item.MatchId}>
            <p>Match: {item.GameType}</p>
            <p>{item.Player1Id} vs {item.Player2Id}</p>
            <p>Score: {item.Player1Points} : {item.Player2Points}</p>
            <p>Winner: {item.WinnerId} by {item.WinningCondition}</p>
        </div>
      ))}

      {totalPages > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MatchHistory_MainDiv;