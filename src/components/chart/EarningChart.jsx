import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';

import { useEffect } from 'react';
import { action_status } from '../../app/constants';
import { getStatistic } from '../../app/slices/statisticSlice';

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
    const { slot } = props;
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;
    const [options, setOptions] = useState(earningChartOptions);
    const { status, statistic } = useSelector((state) => state.statistic);
    const [series7Days, setSeries7Days] = useState([]);
    const [sevenDays, setSevenDays] = useState([]);
    const [twelveMonths, setTwelveMonths] = useState([]);
    const [series12Months, setSeries12Months] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getStatistic());
        }
        if (status === action_status.SUCCEEDED) {
            setSeries7Days(Object.values(statistic[0]));
            setSevenDays(Object.keys(statistic[0]));
            setSeries12Months(Object.values(statistic[1]));
            setTwelveMonths(Object.keys(statistic[1]));
        }

    }, [status, dispatch, statistic]);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
            xaxis: {
                categories:
                    slot === 'month'
                        ? twelveMonths
                        : sevenDays,
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
                tickAmount: slot === 'month' ? 11 : 7
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
    }, [primary, secondary, line, theme, slot, sevenDays, twelveMonths]);

    const [series, setSeries] = useState([
        {
            name: 'Earning',
            data: series7Days
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                name: 'Earning',
                data: slot === 'month' ? series12Months : series7Days
            }
        ])
    }, [slot, series7Days, series12Months]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="area" height={450} />
        </div>
    );
};

export default EarningChart;