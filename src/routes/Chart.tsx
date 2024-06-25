import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface ChartProps {
  coinId: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const ChartContainer = styled.div`
  width: 400px;
  margin-top: 20px;
`;

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <ChartContainer>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price) => Number(price.close)) as number[],
            },
          ]}
          options={{
            theme: { palette: "palette7", mode: isDark ? "dark" : "light"},
            chart: {
              height: "100%",
              width: "100%",
              toolbar: { show: false },
              background: "transparent",
            },
            grid: { show: false },
            yaxis: { show: false },
            xaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toUTCString()
              ),
            },
            stroke: { curve: "smooth", width: 3 },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#fd79a8"], stops: [0, 100] },
            },
            colors: ["#d63031"],
            tooltip: { y: { formatter: (value) => `$ ${value}` } },
          }}
        />
      )}
    </ChartContainer>
  );
}

export default Chart;
