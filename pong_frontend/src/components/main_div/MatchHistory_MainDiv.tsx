import React, { useEffect, useState } from 'react';
import Pagination from '../div/pagination';
import { MatchHistoryItem } from '../../interfaces/matchHistory.interface';
import { UsernameItem } from '../../interfaces/username_list.interface';
import { getGlobalMatchHistory, getPersonalMatchHistory } from '../../api/matchHistory.api';
import { getUserList } from '../../api/user_list.api';
// import {main_div_mode_t} from '../MainDivSelector';

const ITEMS_PER_PAGE = 3;


enum matchHistoryType_t {
    PERSONAL = 0,
    GLOBAL = 1,
  }

interface MatchHistoryProps
{
  userID: number | undefined;
//   mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const MatchHistory_MainDiv: React.FC<MatchHistoryProps>  = ({userID, friend_set}) => {
  const [jsonData, setJsonData] = useState<MatchHistoryItem[]>([]);
  const [usernameList, setusernameList] = useState<UsernameItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyType, setHistoryType]  = useState<number>(matchHistoryType_t.GLOBAL);

  const getData = async () => {
    const usenames = await getUserList();
    setusernameList(usenames);
    if (historyType === matchHistoryType_t.PERSONAL)
    {
        try
        {  
          const matchData = await getPersonalMatchHistory(userID as number)
          setJsonData(matchData);
        }
        catch(error)
        {
          setJsonData([]);
        }
    }
    else if (historyType === matchHistoryType_t.GLOBAL)
    {   
      try
      {  
        const matchData = await getGlobalMatchHistory();
        setJsonData(matchData);
      }
      catch(error)
      {
        setJsonData([]);
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

  const openFriend = (FID:number) => {
    friend_set(FID);
    // mode_set(main_div_mode_t.PUBLIC_PROFILE);
  };

  const openProfile = () => {
    // mode_set(main_div_mode_t.PROFILE);
  }

  const findUsername = (idToFind: number): string | undefined => {
    return usernameList.find((user) => user.id === idToFind)?.username;
  };

  // Split the data into multiple pages
  const totalPages = Math.ceil(jsonData.length / ITEMS_PER_PAGE);
  var startIdx;
  var endIdx;
  var currentPageData: MatchHistoryItem[];
  if (totalPages === 0)
  {
    startIdx = 0;
    endIdx = 0;
    currentPageData = [];
  }
  else
  {
    startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    endIdx = startIdx + ITEMS_PER_PAGE;
    try
    {
      currentPageData = jsonData.slice(startIdx, endIdx);
    }
    catch(error)
    {
      currentPageData = [];
    }
  }

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
            {item.Player1Id === userID && (<p onClick={() => openProfile()} >{findUsername(item.Player1Id)}</p>)}
            {item.Player1Id !== userID && (<p onClick={() => openFriend(item.Player1Id)} >{findUsername(item.Player1Id)}</p> )}
            <p> vs </p>
            {item.Player2Id === userID && (<p onClick={() => openProfile()} >{findUsername(item.Player2Id)}</p>)}
            {item.Player2Id !== userID && (<p onClick={() => openFriend(item.Player2Id)} >{findUsername(item.Player2Id)}</p> )}
            <p>Score: {item.Player1Points} : {item.Player2Points}</p>
            <p>Winner: {findUsername(item.WinnerId)} by {item.WinningCondition}</p>
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