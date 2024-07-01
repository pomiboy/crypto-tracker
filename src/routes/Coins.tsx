import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0 25px;
`;

const Header = styled.header`
  margin: 0 auto;
  height: 10vh;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CoinsList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Coin = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  background-color: #ffffffa8;
  color: ${(props) => props.theme.coinTextColor};
  padding: 5px 8px;
  border-radius: 7px;
  min-width: 400px;
  &:hover {
    background-color: #ffffff66;
    transition: 0.2s;
    color: ${(props) => props.theme.accentColor};
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 40px;
`;

const CoinIcon = styled.img`
  width: 25px;
  height: 25px;
`;

const DarkTogglerContainer = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface IDarkToggler {
  isDark: boolean;
}

const DarkToggler = styled.button<IDarkToggler>`
  /* position: absolute;
  right: 0; */
  all: unset; // wow!
  /* width: 15px;
  height: 15px; */
  width: max-content;
  padding: 3px 5px;
  border-radius: 10px;
  background-color: ${(props) => (props.isDark ? "yellow" : "gray")};
  transition: 0.2s;
  color: black;
  cursor: pointer;
`;


interface CoinTypes {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

interface ICoinsProps {}

function Coins({}: ICoinsProps) {
  // react query 활용
  const { isLoading, data } = useQuery<CoinTypes[]>("allCoins", fetchCoins);
  // react query 활용하지 않은 방법
  // const [coins, setCoins] = useState<CoinTypes[]>([]);
  // const [loading, setLoading] = useState(true);
  // // 코인 API 받아오기
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch(`https://api.coinpaprika.com/v1/coins`);
  //     const json = await response.json();
  //     console.log(json.slice(0, 50));
  //     setCoins(json.slice(0, 50));
  //     setLoading(false);
  //   })();
  // }, []);

  // recoil 사용하여 state 값 바꾸기
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <Container>
      <Header>
        <Title>Coins</Title>
        <DarkTogglerContainer>
          <DarkToggler onClick={toggleDarkAtom} isDark={isDark}>{isDark ? "light" : "dark"}</DarkToggler>
        </DarkTogglerContainer>
      </Header>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CoinsList>
          {data?.slice(0, 50).map((coin) => (
            <Link
              to={{
                pathname: `/${coin.id}`,
                state: { name: coin.name, symbol: coin.symbol },
              }}
            >
              <Coin key={coin.id}>
                <CoinIcon
                  src={`https://cryptoicon-api.pages.dev/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &gt;
              </Coin>
            </Link>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
