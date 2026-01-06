const firebaseUrl = "https://ssmc-daily-report-default-rtdb.firebaseio.com/";
let firebaseFetchUrl = `${firebaseUrl}.json`;
const today = new Date();
let currentYear;

// Get YYYY-MM-DD
let currentDate = today.toISOString().split('T')[0];

let oneYearPreviousDate;
let twoYearPreviousDate;
const maxAttendance = 1000;
let dailyReportData = null;
const yearlyGoal = 100_000;

let oneDayDate;
let twoDayDate;
let threeDayDate;
let fourDayDate;
let fiveDayDate;
let sixDayDate;
let sevenDayDate;

let currentAttendanceData;
let oneYearAttendanceData;
let twoYearAttendanceData;



let oneDayAttendanceData;
let twoDayAttendanceData;
let threeDayAttendanceData;
let fourDayAttendanceData;
let fiveDayAttendanceData;
let sixDayAttendanceData;
let sevenDayAttendanceData;

let currentGeneralRevenue;
let curentMemberRevenue;
let currentShopRevenue;
let currentBirthdayRevenue;
let currentGroupRevenue;
let totalRevenue;

const monthPercents = {
    January: 1.20,
    February: 1.10,
    March: 1.20,
    April: 1.20,
    May: 1.20,
    June: 1.20,
    July: 1.20,
    August: 1.20,
    September: 1.20,
    October: 1.20,
    November: 1.20,
    December: 1.20
};




// Fetch data
function fetchUrlData(urlData) {
    fetch(urlData)
        .then(res => res.json())
        .then(data => {
            dailyReportData = data;

            oneYearPreviousDate = data[currentDate]?.previous_year_date;
            twoYearPreviousDate = data[currentDate]?.second_year_date;




            // const ytdRevenue = calculateYTDRevenue(data, currentDate);
            // populateRevenueMeter(ytdRevenue, yearlyGoal);

            const ytdTotalRevenue = calculateYTDByKey(data, currentDate, 'total_revenue');
            const ytdMembersRevenue = calculateYTDByKey(data, currentDate, 'membership_revenue');
            const ytdGroupRevenue = calculateYTDByKey(data, currentDate, 'group_school_revenue');
            const ytdBirthdayRevenue = calculateYTDByKey(data, currentDate, 'birthday_revenue');
            const ytdSchoolsRevenue = calculateYTDByKey(data, currentDate, 'group_school_revenue');


            populateRevenueMeter({
                ytdRevenue: ytdTotalRevenue,
                yearlyGoal: 100_000,
                fillSelector: '.total-revenue-fill',
                labelSelector: '.total-revenue-meter-label'
            });

            populateRevenueMeter({
                ytdRevenue: ytdMembersRevenue,
                yearlyGoal: 20_000,
                fillSelector: '.membership-revenue-fill',
                labelSelector: '.membership-revenue-meter-label'
            });

            populateRevenueMeter({
                ytdRevenue: ytdGroupRevenue,
                yearlyGoal: 20_000,
                fillSelector: '.shop-revenue-fill',
                labelSelector: '.shop-revenue-meter-label'
            });

            populateRevenueMeter({
                ytdRevenue: ytdBirthdayRevenue,
                yearlyGoal: 20_000,
                fillSelector: '.birthday-revenue-fill',
                labelSelector: '.birthday-revenue-meter-label'
            });

            populateRevenueMeter({
                ytdRevenue: ytdSchoolsRevenue,
                yearlyGoal: 20_000,
                fillSelector: '.group-revenue-fill',
                labelSelector: '.group-revenue-meter-label'
            });



            document.querySelector(".daily-date-heading").textContent = formatDate(currentDate);


            currentAttendanceData = parseInt(data[currentDate]?.attendance || 0);
            oneYearAttendanceData = parseInt(data[oneYearPreviousDate]?.attendance || 0);
            twoYearAttendanceData = parseInt(data[twoYearPreviousDate]?.attendance || 0);
            renderForecast(oneYearPreviousDate)

            let forecastDates = [
                oneDayDate,
                twoDayDate,
                threeDayDate,
                fourDayDate,
                fiveDayDate,
                sixDayDate,
                sevenDayDate
            ];

            // Map each date to an object with attendance and day name
            const forecastData = forecastDates.map(dateStr => {

                const attendance = parseInt(data[dateStr]?.attendance || 0);

                const dayName = data[dateStr]?.day?.slice(0, 3);

                const adjustedAttendance = forecastPercentageIncrease(dateStr, attendance)


                return {
                    date: dateStr,
                    adjustedAttendance,
                    dayName
                };
            });

            console.log(forecastData)

            // Map revenue breakdown to an object
            // const dayData = data[currentDate];

            // const revenueBreakdowndata = {
            //     books: dayData?.books_revenue ?? 0,
            //     creativePlay: dayData?.creative_play_revenue ?? 0,
            //     novelty: dayData?.novelty_revenue ?? 0,
            //     plush: dayData?.plush_revenue ?? 0,
            //     puzzles: dayData?.puzzles_games_revenue ?? 0,
            //     steppingStones: dayData?.stepping_stones_revenue ?? 0,
            //     toys: dayData?.toys_revenue ?? 0
            // };


            currentGeneralRevenue = parseInt(data[currentDate]?.general_admission_revenue || 0);
            curentMemberRevenue = parseInt(data[currentDate]?.membership_revenue || 0);
            currentShopRevenue = parseInt(data[currentDate]?.shop_revenue || 0);
            currentBirthdayRevenue = parseInt(data[currentDate]?.birthday_revenue || 0);
            currentGroupRevenue = parseInt(data[currentDate]?.group_school_revenue || 0);
            totalRevenue = parseInt(data[currentDate]?.total_revenue || 0);



            populateBarGraph(twoYearAttendanceData, oneYearAttendanceData, currentAttendanceData);
            populateRevenuePie(currentGeneralRevenue, curentMemberRevenue, currentShopRevenue, currentBirthdayRevenue, currentGroupRevenue, totalRevenue);
            populateForecastBarGraph(forecastData)

            // populateRevenueBreakdownBarGraph(revenueBreakdowndata)
        })
        .catch(err => console.error("Failed to fetch schedule data:", err));
}

// Change date format
function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);


    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
}




// Attendance as a percentage 
function attendancePercentage(date) {
    const percentage = Math.floor((parseInt(dailyReportData[date]?.attendance) / maxAttendance) * 100);
    return percentage;
}

// Bar graph
function populateBarGraph(one, two, three) {
    let currentPercentage = attendancePercentage(currentDate);
    let oneYearPercentage = attendancePercentage(oneYearPreviousDate);
    let twoYearPercentage = attendancePercentage(twoYearPreviousDate);




    const barPercentages = [twoYearPercentage, oneYearPercentage, currentPercentage];
    document.querySelectorAll(".bar").forEach((bar, i) => {

        bar.style.height = barPercentages[i] + "%";
    });

    const barValues = [one, two, three];
    document.querySelectorAll(".bar-label").forEach((bar, i) => {
        bar.textContent = barValues[i];
    });
}



// Forecast Bar graph Section
// Adjusting percentage increase
function forecastPercentageIncrease(dateStr, forecastIncreaseData) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    let forecastIncreaseDate = date.toLocaleString('en-US', { month: 'long' });
    // console.log("Date", date)
    // console.log("forecast Date", forecastIncreaseDate)

    adjustedForecastData = Math.floor(
        forecastIncreaseData * ((monthPercents[forecastIncreaseDate] ?? 1))
    );



    return adjustedForecastData;
}

// Poplating Bar Graphs
function populateForecastBarGraph(forecastData) {
    forecastData.forEach((day, i) => {
        document.querySelectorAll(".forecast-bar-label")[i].textContent = day.adjustedAttendance;
        document.querySelectorAll(".forecast-label")[i].textContent = day.dayName;
    });


    let onePercentage = attendancePercentage(oneDayDate);
    let twoPercentage = attendancePercentage(twoDayDate);
    let threePercentage = attendancePercentage(threeDayDate);
    let fourPercentage = attendancePercentage(fourDayDate);
    let fivePercentage = attendancePercentage(fiveDayDate);
    let sixPercentage = attendancePercentage(sixDayDate);
    let sevenPercentage = attendancePercentage(sevenDayDate);


    const barPercentages = [onePercentage, twoPercentage, threePercentage, fourPercentage, fivePercentage, sixPercentage, sevenPercentage];
    document.querySelectorAll(".forecast-bar").forEach((bar, i) => {
        bar.style.height = barPercentages[i] + "%";
    });
}

function populateRevenueBreakdownBarGraph(revenueData) {
    const containers = document.querySelectorAll(".revenue-breakdown-bar-container");

    const values = Object.values(revenueData);
    const maxValue = Math.max(...values, 1);

    containers.forEach(container => {
        const key = container.dataset.key;
        const value = revenueData[key] ?? 0;

        const bar = container.querySelector(".revenue-breakdown-bar");
        const label = container.querySelector(".revenue-breakdown-bar-label");

        const widthPercent = (value / maxValue) * 100;

        bar.style.width = `${widthPercent}%`;
        label.textContent = `$${value.toLocaleString()}`;
    });
}

// Pie chart
function populateRevenuePie(one, two, three, four, five, totalRevenue) {
    const values = [one, two, three, four, five];
    const colors = ['#1abc9c', '#f1c40f', '#e74c3c', '#9b59b6', '#4a90e2'];

    let gradient = 'conic-gradient(';
    let start = 0;

    document.querySelector(".pie-revenue-total").textContent = totalRevenue;

    const pieValues = [one, two, three, four, five];
    document.querySelectorAll(".pie-revenue").forEach((slice, i) => {
        slice.textContent = pieValues[i];
    });

    values.forEach((value, i) => {
        const percentage = (value / totalRevenue) * 100;
        gradient += `${colors[i]} ${start}% ${start + percentage}%, `;
        start += percentage;
    });


    gradient = gradient.slice(0, -2) + ')';
    document.getElementById('pie').style.background = gradient;
}

// Date helpers
function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function nextDay() {
    currentDate = addDays(currentDate, 1);
    oneYearPreviousDate = addDays(oneYearPreviousDate, 1);
    twoYearPreviousDate = addDays(twoYearPreviousDate, 1);


    renderForecast(oneYearPreviousDate)
    renderDates();
}

function previousDay() {
    currentDate = addDays(currentDate, -1);
    oneYearPreviousDate = addDays(oneYearPreviousDate, -1);
    twoYearPreviousDate = addDays(twoYearPreviousDate, -1);

    renderForecast(oneYearPreviousDate)
    renderDates();
}

function renderForecast(date) {
    oneDayDate = addDays(date, + 1);
    twoDayDate = addDays(date, + 2);
    threeDayDate = addDays(date, + 3);
    fourDayDate = addDays(date, + 4);
    fiveDayDate = addDays(date, + 5);
    sixDayDate = addDays(date, + 6);
    sevenDayDate = addDays(date, + 7);

}

function renderDates() {
    // console.log('Current:', currentDate);
    // console.log('1 Year Ago:', oneYearPreviousDate);
    // console.log('2 Years Ago:', twoYearPreviousDate);

    // console.log('1 day:', oneDayDate);
    // console.log('2 day:', twoDayDate);
    // console.log('3 day:', threeDayDate);
    // console.log('4 day:', fourDayDate);
    // console.log('5 day:', fiveDayDate);
    // console.log('6 day:', sixDayDate);
    // console.log('7 day:', sevenDayDate);

    fetchUrlData(firebaseFetchUrl);
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {

    fetchUrlData(firebaseFetchUrl);
    //renderForecast(oneYearPreviousDate);

});

function parseLocalDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // LOCAL midnight
}




// function calculateYTDRevenue(data, currentDateStr) {
//     const currentDateObj = parseLocalDate(currentDateStr);
//     const currentYear = currentDateObj.getFullYear();

//     let ytdRevenue = 0;

//     Object.entries(data).forEach(([dateStr, dayData]) => {
//         const dateObj = parseLocalDate(dateStr);

//         if (
//             dateObj.getFullYear() === currentYear &&
//             dateObj <= currentDateObj
//         ) {
//             ytdRevenue += Number(dayData?.total_revenue || 0);
//         }
//     });

//     return ytdRevenue;
// }



// function populateRevenueMeter(ytdRevenue, yearlyGoal) {
//     const percentage = Math.min((ytdRevenue / yearlyGoal) * 100, 100);
//     console.log("Second Rev", ytdRevenue)
//     console.log("Rev Goal", yearlyGoal)
//     document.querySelector('.total-revenue-fill').style.height =
//         `${percentage}%`;

//     document.querySelector('.total-revenue-meter-label').textContent =
//         `$${ytdRevenue.toLocaleString()} (${percentage.toFixed(1)}%)`;
// }

function calculateYTDByKey(data, currentDateStr, revenueKey) {
    const currentDateObj = parseLocalDate(currentDateStr);
    const currentYear = currentDateObj.getFullYear();

    let ytdTotal = 0;

    Object.entries(data).forEach(([dateStr, dayData]) => {
        const dateObj = parseLocalDate(dateStr);

        if (
            dateObj.getFullYear() === currentYear &&
            dateObj <= currentDateObj
        ) {
            ytdTotal += Number(dayData?.[revenueKey] || 0);
        }
    });

    return ytdTotal;
}

function populateRevenueMeter({
    ytdRevenue,
    yearlyGoal,
    fillSelector,
    labelSelector
}) {
    const percentage = Math.min((ytdRevenue / yearlyGoal) * 100, 100);

    document.querySelector(fillSelector).style.height = `${percentage}%`;
    document.querySelector(labelSelector).textContent =
        `$${ytdRevenue.toLocaleString()} (${percentage.toFixed(1)}%)`;
}





