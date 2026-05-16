export type ForecastRowProps = {
    date: string;
    highF: number;
    lowF: number;
    condition: string;
    rainChance: number;
}

function ForecastRow({ date, highF, lowF, condition, rainChance }: ForecastRowProps) {
  return (
    <div>
      <h2>{date}</h2>
      <p>{highF}°F/{lowF}°F</p>
      <p>{condition}</p>
      <p>{rainChance}%</p>
    </div>
  );
}

export default ForecastRow;