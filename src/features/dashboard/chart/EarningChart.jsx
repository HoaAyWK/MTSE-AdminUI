import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const earningChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};



const EarningChart = (props) => {
    const { slot, days, months, hours } = props;
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;
    const [options, setOptions] = useState(earningChartOptions);
    const [series7Days, setSeries7Days] = useState([]);
    const [sevenDays, setSevenDays] = useState([]);
    const [oneMonth, setOneMonth] = useState([]);
    const [seriesOneMonth, setSeriesOneMonth] = useState([]);
    const [series24Hours, setSeries24Hours] = useState([]);
    const [twentyFourHours, setTwentyFourHours] = useState([]);

    useEffect(() => {
        if (days && months && hours) {
            setSeries7Days(Object.values(days));
            setSevenDays(Object.keys(days));
            setSeriesOneMonth(Object.values(months));
            setOneMonth(Object.keys(months));
            setTwentyFourHours(Object.keys(hours));
            setSeries24Hours(Object.values(hours));
        }

    }, [days, months, hours]);

    useEffect(() => {
        if (slot === 'month') {
            setOptions((prevState) => ({
                ...prevState,
                colors: [theme.palette.success.main, theme.palette.success[700]],
                xaxis: {
                    categories: oneMonth,
                    labels: {
                        style: {
                            colors: [
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary
                            ]
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: line
                    },
                    tickAmount: 15,
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: [secondary]
                        }
                    }
                },
                grid: {
                    borderColor: line
                },
                tooltip: {
                    theme: 'light'
                }
            }));
        } else if (slot === 'week') {
            setOptions((prevState) => ({
                ...prevState,
                colors: [theme.palette.success.main, theme.palette.success[700]],
                xaxis: {
                    categories: sevenDays,
                    labels: {
                        style: {
                            colors: [
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary
                            ]
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: line
                    },
                    tickAmount: 7,
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: [secondary]
                        }
                    }
                },
                grid: {
                    borderColor: line
                },
                tooltip: {
                    theme: 'light'
                }
            }));
        } else {
            setOptions((prevState) => ({
                ...prevState,
                colors: [theme.palette.success.main, theme.palette.success[700]],
                xaxis: {
                    categories: twentyFourHours,
                    labels: {
                        style: {
                            colors: [
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary,
                                secondary
                            ]
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: line
                    },
                    tickAmount: 12,
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: [secondary]
                        }
                    }
                },
                grid: {
                    borderColor: line
                },
                tooltip: {
                    theme: 'light'
                }
            }));
        }
    }, [primary, secondary, line, theme, slot, sevenDays, oneMonth, twentyFourHours]);

    const [series, setSeries] = useState([
        {
            name: 'Earning',
            data: series24Hours
        }
    ]);

    useEffect(() => {
        if (slot === 'month') {
            setSeries([
                {
                    name: 'Earning',
                    data: seriesOneMonth
                }
            ])
        } else if (slot === 'week') {
            setSeries([
                {
                    name: 'Earning',
                    data: series7Days
                }
            ])
        } else {
            setSeries([
                {
                    name: 'Earning',
                    data: series24Hours
                }
            ])
        }
    }, [slot, series24Hours, series7Days, seriesOneMonth]);

    return (
        <div id="chart-area">
            <ReactApexChart options={options} series={series} type="area" height={450} />
        </div>
    );
};

export default EarningChart;