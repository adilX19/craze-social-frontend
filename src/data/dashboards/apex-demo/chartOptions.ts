import dayjs from 'dayjs'
import { useThemeColors } from '/@src/composable/useThemeColors'
const themeColors = useThemeColors()

const xSeries = [{
  name: 'Video',
  data: [24, 75, 41, 67, 22, 43],
},
{
  name: 'Video',
  data: [13, 23, 20, 80, 13, 87],
}]

const c1Series = [{
  name: 'Video',
  data: [44, 55, 41, 67, 22, 43],
},
{
  name: 'Video',
  data: [13, 23, 20, 80, 13, 27],
}]

const c2Series = [{
  name: 'Video',
  data: [15, 20, 35, 67, 10, 43],
},
{
  name: 'Video',
  data: [50, 23, 11, 50, 13, 20],
}]

const c3Series = [{
  name: 'Video',
  data: [35, 25, 35, 55, 10, 43],
},
{
  name: 'Video',
  data: [30, 11, 60, 50, 13, 20],
}]

const c4Series = [{
  name: 'Video',
  data: [35, 25, 35, 55, 10, 43],
},
{
  name: 'Video',
  data: [30, 11, 60, 50, 13, 20],
}]

const c5Series = [{
  name: 'Video',
  data: [35, 55, 60, 55, 10, 43],
},
{
  name: 'Video',
  data: [90, 11, 60, 75, 13, 20],
}]

const c6Series = [{
  name: 'Video',
  data: [15, 55, 60, 55, 10, 43],
},
{
  name: 'Video',
  data: [10, 45, 50, 85, 13, 20],
}]

import * as formatters from '/@src/utils/apex-formatters'
import { dataSeries } from './data/dataSeries'
import { series } from './data/series'

export const followersChartOptions = {
  series: [
    {
      name: 'Klylie Jenner',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: 'Selena Gomez',
      data: [60, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
    {
      name: 'Selena Gomez',
      data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
    },
    {
      name: 'Selena Gomez',
      data: [35, 57, 74, 40, 45, 18, 20, 47, 36, 56, 45, 36],
    },
    {
      name: 'Selena Gomez',
      data: [20, 57, 74, 51, 60, 51, 50, 47, 82, 56, 45, 32],
    },
    {
      name: 'Selena Gomez',
      data: [10, 22, 23, 35, 75, 70, 30, 47, 99, 56, 45, 47],
    },
    {
      name: 'Selena Gomez',
      data: [5, 12, 13, 75, 75, 38, 50, 47, 82, 56, 45, 45],
    }
  ],
  chart: {
    height: 500,
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.accent, themeColors.warning, themeColors.purple],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width:[3,3,3,3,3,3,3],
    curve: 'smooth',
    dashArray: [0,5, 5, 5, 5, 5, 5],
  },
  title: {
    text: 'Followers',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6,
    },
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
  tooltip: {
    y: [
      {
        title: {
          formatter: formatters.toString,
        },
      },
    ],
  },
  grid: {
    borderColor: '#f1f1f1',
  },
}

export const videoChartOptions = {
  series: [
    {
      name: 'Klylie Jenner',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: 'Selena Gomez',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: 'Selena Gomez',
      data: [35, 41, 36, 26, 45, 48, 70, 53, 41],
    },
    {
      name: 'Selena Gomez',
      data: [10, 41, 26, 20, 45, 41, 100, 110, 41],
    },
    {
      name: 'Selena Gomez',
      data: [40, 41, 36, 45, 45, 48, 52, 41, 41],
    },
    {
      name: 'Selena Gomez',
      data: [22, 41, 25, 26, 45, 48, 60, 53, 41],
    },
    {
      name: 'Selena Gomez',
      data: [18, 25, 30, 15, 45, 40, 52, 53, 41],
    }
  ],
  chart: {
    type: 'bar',
    height: 500,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.danger, themeColors.warning, themeColors.purple],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: [1],
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  title: {
    text: 'Video Posting & Normal Posting',
    align: 'left',
  },
  tooltip: {
    y: {
      formatter: formatters.asKDollar,
    },
  },
}

export const interactionChartOptions = {
  series: [
    {
      name: 'Klylie Jenner',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 61, 58],
    },
    {
      name: 'Selena Gomez',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 87, 105],
    },
    {
      name: 'Selena Gomez',
      data: [35, 41, 36, 26, 45, 48, 70, 53, 41, 48, 70],
    },
    {
      name: 'Selena Gomez',
      data: [10, 41, 26, 20, 45, 41, 100, 110, 41, 100, 110],
    },
    {
      name: 'Selena Gomez',
      data: [40, 41, 36, 45, 45, 48, 52, 41, 41, 53, 41],
    },
    {
      name: 'Selena Gomez',
      data: [22, 41, 25, 26, 45, 48, 60, 53, 41, 100, 110],
    },
    {
      name: 'Selena Gomez',
      data: [18, 25, 30, 15, 45, 40, 52, 53, 41, 53, 41],
    }
  ],
  chart: {
    type: 'bar',
    height: 500,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.danger, themeColors.warning, themeColors.purple],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'top',
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  xaxis: {
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  },
  title: {
    text: 'Interaction per Month',
    align: 'left',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  fill: {
    opacity: 1,
  },
}

export const engagementChartOptions = {
  series: [
    {
      name: 'Klylie Jenner',
      data: [120, 50, 30, 40, 100, 20],
    },
    {
      name: 'Selena Gomez',
      data: [30, 45, 60, 30, 85, 10],
    },
    {
      name: 'Selena Gomez',
      data: [115, 45, 50, 20, 60, 10],
    },
    {
      name: 'Selena Gomez',
      data: [45, 115, 75, 35, 90, 10],
    },
    {
      name: 'Selena Gomez',
      data: [20, 45, 80, 85, 70, 100],
    },
    {
      name: 'Selena Gomez',
      data: [120, 45, 35, 75, 90, 70],
    },
    {
      name: 'Selena Gomez',
      data: [15, 70, 60, 15, 80, 10],
    }
  ],
  chart: {
    height: 500,
    type: 'radar',
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.primary, themeColors.info, themeColors.green, themeColors.orange, themeColors.danger, themeColors.warning, themeColors.purple],
  title: {
    text: 'Best Monthly Engagement',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  xaxis: {
    categories: ['January', 'February', 'March', 'April', 'May', 'June'],
  },
}

export const totalChartOptions = {
  series: [35, 75, 120],
  chart: {
    height: 300,
    type: 'radialBar',
    toolbar: {
      show: false,
    },
  },
  colors: [
    themeColors.primary,
    themeColors.accent,
    themeColors.accentLight,
  ],
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '12px'
        },
        value: {
          fontSize: '14px'
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (/* value: string */) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return 230
          },
        },
      },
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlignment: 'center'
  },
  labels: ['Followers', 'Engagement', 'Posting freq'],
}
