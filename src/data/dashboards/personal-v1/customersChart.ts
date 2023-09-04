import { useThemeColors } from '/@src/composable/useThemeColors'
const themeColors = useThemeColors()

export const customersOptions = {
  series: [
    {
      name: 'Instagram',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'Tiktok',
      data: [11, 32, 45, 32, 34, 52, 41],
    }
  ],
  chart: {
    height: 325,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent, themeColors.info, themeColors.green],
  title: {
    text: 'Engagement',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2, 2],
    curve: 'smooth',
  },
  xaxis: {
    type: 'text',
    categories: ['January', 'February', 'March', 'April', 'May', 'June'],
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
}
