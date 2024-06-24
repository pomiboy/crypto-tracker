import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";

const Container = styled.div`
  padding: 0 25px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

interface CoinTypes {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const { isLoading, data } = useQuery<CoinTypes[]>("allCoins", fetchCoins);
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
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
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