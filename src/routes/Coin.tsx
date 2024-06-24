import { useState, useEffect } from "react";
import {
  useLocation,
  useParams,
  useRouteMatch,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinPrice } from "../api";

const Container = styled.div`
  padding: 0 25px;
`;

const HomeBtn = styled.div`
  position: absolute;
  top: 15px;
  width: max-content;
  padding: 5px 10px;
  border: 1px solid ${(props) => props.theme.textColor};
  border-radius: 10px;
  &:hover {
    background-color: slategray;
    transition: 0.2s;
  }
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 40px;
`;

const CoinIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoWrapper = styled.div`
  width: 400px;
`;

const MainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
`;

const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  div:first-child {
    font-size: 20px;
    font-weight: bold;
  }
`;

const Description = styled.div`
  line-height: 23px;
`;

const Tabs = styled.div`
  margin-top: 20px;
  width: 400px;
  display: flex;
  justify-content: space-between;
`;

const Tab = styled.div<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  padding: 7px 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  &:hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: 0.2s;
  }
`;

const PriceInfo = styled.div`
  font-weight: bold;
  font-size: 19px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
  symbol: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

interface ICoinProps {
  isDark: boolean;
}

function Coin({ isDark }: ICoinProps) {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price"); // 내가 해당 URL에 있는지를 확인할 수 있는 훅
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: priceLoading, data: priceData } = useQuery<PriceData>(
    ["price", coinId],
    () => fetchCoinPrice(coinId)
  );
  // const { isLoading: priceLoading, data: priceData } = useQuery<PriceData>(
  //   ["price", coinId],
  //   () => fetchCoinPrice(coinId)
  // );

  // const [loading, setLoading] = useState(true);
  // const [info, setInfo] = useState<InfoData>();
  // const [priceInfo, setPriceInfo] = useState<PriceData>();
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     console.log(infoData);
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   })();
  // }, [coinId]);

  return (
    <Container>
      <Link to="/">
        <HomeBtn>Home</HomeBtn>
      </Link>
      <Header>
        <Title>
          {state?.name
            ? state.name
            : infoLoading
            ? "Loading..."
            : infoData?.name}
        </Title>
      </Header>
      {infoLoading ? (
        <p>Loading...</p>
      ) : (
        <InfoContainer>
          <InfoWrapper>
            <MainInfo>
              <CoinIcon
                src={`https://cryptoicon-api.pages.dev/api/icon/${infoData?.symbol.toLowerCase()}`}
              />
              <NameInfo>
                <div>
                  {state?.name
                    ? state.name
                    : infoLoading
                    ? "Loading..."
                    : infoData?.name}
                </div>
                <div>
                  {state?.symbol
                    ? state.symbol
                    : infoLoading
                    ? "Loading..."
                    : infoData?.symbol}
                  (Rank#{infoData?.rank})
                </div>
              </NameInfo>
              <PriceInfo>${priceData?.quotes.USD.price.toFixed(3)}</PriceInfo>
            </MainInfo>
            <Description>{infoData?.description}</Description>
          </InfoWrapper>

          <Tabs>
            <Link to={`/${coinId}/price`}>
              <Tab isActive={priceMatch !== null}>Price</Tab>
            </Link>
            <Link to={`/${coinId}/chart`}>
              <Tab isActive={chartMatch !== null}>Chart</Tab>
            </Link>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} isDark={isDark}/>
            </Route>
          </Switch>
        </InfoContainer>
      )}
    </Container>
  );
}

export default Coin;
