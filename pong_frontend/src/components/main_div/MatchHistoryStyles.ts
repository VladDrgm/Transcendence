import styled, { CSSProperties } from 'styled-components';

export const MatchHistoryCard = styled.div`
  border: 1px solid #ccc;
  padding: 5px;
  overflow: hidden;
  margin: 10px auto;
  background-color: #333333;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;

  p {
    margin: 5px 0;
  }

  a {
    text-decoration: none;
    color: red;

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
  color: 'white',
  fontSize: '16px',
  fontWeight: 400,

};

export const MatchHistoryWinner: CSSProperties = {
  color: 'white',
  fontSize: '16px',
  fontWeight: 400,
};

export const ButtonStyle: CSSProperties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	display: 'inline-block',
	height:'40px',
	width:'150px',
	fontFamily: 'Shlop',
	fontSize: '14px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '1px solid white',
	color:'white',
	marginBottom: '30px',
    marginTop: '30px',
}