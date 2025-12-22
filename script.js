const firebaseUrl = "https://ssmc-daily-report-default-rtdb.firebaseio.com/";
let firebaseFetchUrl = `${firebaseUrl}.json`;
let currentDate = '2025-12-18';
let oneYearPreviousDate = '2024-12-19';
let twoYearPreviousDate = '2023-12-14';
const maxAttendance = 1000;
let dailyReportData;

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


// Fetch data
function fetchUrlData(urlData) {
    fetch(urlData)
        .then(res => res.json())
        .then(data => {
            dailyReportData = data;

            const yearlyGoal = 100_000; // example goal
            const ytdRevenue = calculateYTDRevenue(data, currentDate);

            populateRevenueMeter(ytdRevenue, yearlyGoal);


            document.querySelector(".daily-date-heading").textContent = formatDate(currentDate);;


            currentAttendanceData = parseInt(data[currentDate]?.attendance || 0);
            oneYearAttendanceData = parseInt(data[oneYearPreviousDate]?.attendance || 0);
            twoYearAttendanceData = parseInt(data[twoYearPreviousDate]?.attendance || 0);

            oneDayAttendanceData = parseInt(data[oneDayDate]?.attendance || 0);
            twoDayAttendanceData = parseInt(data[twoDayDate]?.attendance || 0);
            threeDayAttendanceData = parseInt(data[threeDayDate]?.attendance || 0);
            fourDayAttendanceData = parseInt(data[fourDayDate]?.attendance || 0);
            fiveDayAttendanceData = parseInt(data[fiveDayDate]?.attendance || 0);
            sixDayAttendanceData = parseInt(data[sixDayDate]?.attendance || 0);
            sevenDayAttendanceData = parseInt(data[sevenDayDate]?.attendance || 0);

            currentGeneralRevenue = parseInt(data[currentDate]?.general_admission_revenue || 0);
            curentMemberRevenue = parseInt(data[currentDate]?.membership_revenue || 0);
            currentShopRevenue = parseInt(data[currentDate]?.shop_revenue || 0);
            currentBirthdayRevenue = parseInt(data[currentDate]?.birthday_revenue || 0);
            currentGroupRevenue = parseInt(data[currentDate]?.group_school_revenue || 0);
            totalRevenue = parseInt(data[currentDate]?.total_revenue || 0);

            populateBarGraph(twoYearAttendanceData, oneYearAttendanceData, currentAttendanceData);
            populateRevenuePie(currentGeneralRevenue, curentMemberRevenue, currentShopRevenue, currentBirthdayRevenue, currentGroupRevenue, totalRevenue);
            populateForecastBarGraph(oneDayAttendanceData, twoDayAttendanceData, threeDayAttendanceData, fourDayAttendanceData, fiveDayAttendanceData, sixDayAttendanceData, sevenDayAttendanceData)

            console.log("Rendered Info", data);
            console.log("Current Attendance", currentAttendanceData);
        })
        .catch(err => console.error("Failed to fetch schedule data:", err));
}

// Change date format
function formatDate(dateStr) {
    const date = new Date(dateStr);

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
        console.log("Current Percent: ", currentPercentage)
        console.log("One Year Percent: ", oneYearPercentage)
        console.log("Two Year Percent: ", twoYearPercentage)
        bar.style.height = barPercentages[i] + "%";
    });

    const barValues = [one, two, three];
    document.querySelectorAll(".bar-label").forEach((bar, i) => {
        bar.textContent = barValues[i];
    });
}

// Forecast Bar graph
function populateForecastBarGraph(one, two, three, four, five, six, seven) {
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

    const barValues = [one, two, three, four, five, six, seven];
    document.querySelectorAll(".forecast-bar-label").forEach((bar, i) => {
        bar.textContent = barValues[i];
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
    console.log('Current:', currentDate);
    console.log('1 Year Ago:', oneYearPreviousDate);
    console.log('2 Years Ago:', twoYearPreviousDate);

    console.log('1 day:', oneDayDate);
    console.log('2 day:', twoDayDate);
    console.log('3 day:', threeDayDate);
    console.log('4 day:', fourDayDate);
    console.log('5 day:', fiveDayDate);
    console.log('6 day:', sixDayDate);
    console.log('7 day:', sevenDayDate);
    fetchUrlData(firebaseFetchUrl);
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderForecast(oneYearPreviousDate)
    fetchUrlData(firebaseFetchUrl);
});

// function updateRevenueMeter(ytdRevenue, yearlyGoal) {
//     const percent = Math.min((ytdRevenue / yearlyGoal) * 100, 100);

//     document.getElementById("revenue-fill").style.width = `${percent}%`;
//     document.getElementById("revenue-percent").textContent = `${percent.toFixed(1)}%`;

//     document.getElementById("ytd-revenue").textContent =
//         `$${ytdRevenue.toLocaleString()}`;
//     document.getElementById("goal-revenue").textContent =
//         `$${yearlyGoal.toLocaleString()}`;
// }

// // Example usage
// updateRevenueMeter(642000, 1000000);

function calculateYTDRevenue(data, currentDate) {
    const currentYear = currentDate.split('-')[0]; // "2025"
    let ytdRevenue = 0;

    Object.entries(data).forEach(([date, dayData]) => {
        if (
            date.startsWith(currentYear) &&
            date <= currentDate
        ) {
            ytdRevenue += parseInt(dayData?.total_revenue || 0);
        }
    });

    return ytdRevenue;
}



function populateRevenueMeter(ytdRevenue, yearlyGoal) {
    const percentage = Math.min((ytdRevenue / yearlyGoal) * 100, 100);

    document.querySelector('.revenue-meter-fill').style.height =
        `${percentage}%`;

    document.querySelector('.revenue-meter-label').textContent =
        `$${ytdRevenue.toLocaleString()} of $${yearlyGoal.toLocaleString()} (${percentage.toFixed(1)}%)`;
}



