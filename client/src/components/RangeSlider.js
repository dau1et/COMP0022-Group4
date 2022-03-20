import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
    {
      value: 1900,
      label: '1900',
    },
    {
      value: 2020,
      label: '2020',
    }
  ];

function valuetext(value) {
  return `${value}`;
}

export default function RangeSlider() {
  const [range, setRange] = React.useState([1900, 2020]);
  const [bounds, setBounds] = React.useState(["1990-01-01 00:00:01", "2020-12-31 23:59:59"])
  const handleChange = (event, newValue) => {
    //console.log(newValue)
    var range_lb = `${range[0]}-01-01 00:00:01`
    var range_up = `${range[1]}-12-31 23:59:59`
    setBounds([range_lb, range_up])
    console.log(bounds)
    setRange(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Release Date'}
        value={range}
        onChange={handleChange}
        valueLabelDisplay="on"
        step = {1}
        getAriaValueText={valuetext}
        marks = {marks}
        min={1900}
        max={2020}
      />
    </Box>
  );
}