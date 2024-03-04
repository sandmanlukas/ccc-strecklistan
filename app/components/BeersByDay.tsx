// import { AxisOptions, Chart } from "react-charts";
import { Bar } from 'recharts';


type DrinkByDay = {
    weekday: string;
    drinks: number;
}

type Series = {
    label: string,
    data: DrinkByDay[],
}

