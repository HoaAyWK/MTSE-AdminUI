import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const barChartOptions = {
    chart: {
        type: 'bar',
        height: 365,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '45%',
            borderRadius: 4
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: false
    },
    grid: {
        show: false
    }
};

const JobChart = (props) => {
    const { slot, days, months, hours } = props;
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const info = theme.palette.info.light;

    const [options, setOptions] = useState(barChartOptions);
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
            setOneMonth(Object.keys(months));
            setSeriesOneMonth(Object.values(months))
            setTwentyFourHours(Object.keys(hours));
            setSeries24Hours(Object.values(hours));
        }

    }, [days, months, hours]);


    useEffect(() => {
        if (slot === 'month') {
            setOptions((prevState) => ({
                ...prevState,
                colors: [info],
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
                                secondary,
                                secondary,
                                secondary,
                                
                            ]
                        }
                    },
                },
                tooltip: {
                    theme: 'light'
                }
            }));
        } else if (slot === 'week') {
            setOptions((prevState) => ({
                ...prevState,
                colors: [info],
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
                },
                tooltip: {
                    theme: 'light'
                }
            }));
        } else {
            setOptions((prevState) => ({
                ...prevState,
                colors: [info],
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
                },
                tooltip: {
                    theme: 'light'
                }
            }));
        }
    }, [primary, secondary, theme, slot, sevenDays, oneMonth, twentyFourHours]);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [info],
            xaxis: {
                labels: {
                    style: {
                        colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
                    }
                }
            },
            tooltip: {
                theme: 'light'
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [primary, info, secondary]);

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
                    name: 'Job',
                    data: seriesOneMonth
                }
            ])
        } else if (slot === 'week') {
            setSeries([
                {
                    name: 'Job',
                    data: series7Days
                }
            ])
        } else {
            setSeries([
                {
                    name: 'Job',
                    data: series24Hours
                }
            ])
        }
    }, [slot, series24Hours, series7Days, seriesOneMonth]);

    return (
        <div id="chart-bar">
            <ReactApexChart options={options} series={series} type="bar" height={365} />
        </div>
    );
}

export default JobChart;