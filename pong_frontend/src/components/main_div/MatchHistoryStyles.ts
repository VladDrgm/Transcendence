import styled, { CSSProperties } from 'styled-components';

export const MatchHistoryCard = styled.div`
  border: 1px solid #ccc;
  padding: 5px;
  overflow: hidden;
  margin: 10px auto;
  background-color: #87CEEB;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;

  p {
    margin: 5px 0;
  }

  a {
    text-decoration: none;
    color: #FFD700;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const MatchHistoryTitle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 400,
};

export const MatchHistoryScore: CSSProperties = {
  color: 'black',
  fontSize: '16px',
  fontWeight: 400,

};

export const MatchHistoryWinner: CSSProperties = {
  color: 'black',
  fontSize: '16px',
  fontWeight: 400,
};

export const ButtonStyle: CSSProperties = {
  display: 'inline-block',
  padding: '12px 20px',
  fontSize: '16px',
  textAlign: 'center',
  textDecoration: 'none',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  backgroundColor: '#87CEEB',
  color: '#000000',
  margin: '10px 100px',
  background: 'linear-gradient(45deg, #87CEEB, #0071BB)',
  height:'40px',
  width:'200px',
}