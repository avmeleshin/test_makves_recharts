import {type FC} from "react";
import {CartesianGrid, Dot, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const calcZScore = (data: number[]): number[] => {
  const mean = data.reduce((acc, n) => acc + n, 0) / data.length;

  const standardDeviation = Math.sqrt(data
    .map(n => Math.pow(n - mean, 2))
    .reduce((acc, n) => acc + n, 0) / (data.length - 1))

  return data.map(n => Math.abs((n - mean) / standardDeviation));
}

const zPV = calcZScore(data.map(d => d.pv));
const zUV = calcZScore(data.map(d => d.uv));

interface ILinearGradientProps {
  type: 'uv' | 'pv',
  data: number[],
  color: string
}

const LinearGradient: FC<ILinearGradientProps> = ({type, data, color}) => (
  <linearGradient id={`color${type.toUpperCase()}`} x1='0' y1='0' x2='100%' y2='0'>
    {data.map((z, i) => (
      <stop key={i} offset={`${100 - (data.length - i - 1) * 100 / (data.length - 1)}%`}
            stopColor={z > 1 ? 'red' : color}/>
    ))}
  </linearGradient>
);

/* eslint-disable  @typescript-eslint/no-explicit-any */
const CustomizedDot: FC<any> = (props) => {
  const color = props.dataKey === 'uv' ? '#82ca9d' : '#8884d8';
  const data = props.dataKey === 'uv' ? zUV : zPV;

  return (
    <Dot
      {...props}
      stroke={data[props.index] > 1 ? 'red' : color}
    />
  )
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
const CustomizedActiveDot: FC<any> = (props) => {
  const color = props.dataKey === 'uv' ? '#82ca9d' : '#8884d8';
  const data = props.dataKey === 'uv' ? zUV : zPV;

  return (
    <Dot
      {...props}
      r={props.dataKey === 'uv' ? props.r : 8}
      fill={data[props.index] > 1 ? 'red' : color}
    />
  )
}

function App() {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{top: 5, right: 30, left: 20, bottom: 5}}
    >
      <defs>
        <LinearGradient type='pv' data={zPV} color='#8884d8'/>
        <LinearGradient type='uv' data={zUV} color='#82ca9d'/>
      </defs>

      <CartesianGrid strokeDasharray='3 3'/>
      <XAxis dataKey='name'/>
      <YAxis/>
      <Tooltip/>
      <Legend/>

      <Line type='monotone' dataKey='pv' stroke='url(#colorPV)' dot={<CustomizedDot/>}
            activeDot={<CustomizedActiveDot/>}/>
      <Line type='monotone' dataKey='uv' stroke='url(#colorUV)' dot={<CustomizedDot/>}
            activeDot={<CustomizedActiveDot/>}/>
    </LineChart>
  )
}

export default App
