const firebaseUrl = "https://ssmc-daily-report-default-rtdb.firebaseio.com/";
let firebaseFetchUrl = `${firebaseUrl}.json`;
let currentDate = '2025-12-18';
let oneYearPreviousDate = '2024-12-19';
let twoYearPreviousDate = '2023-12-14';

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


// Fetch data
function fetchUrlData(urlData) {
    fetch(urlData)
        .then(res => res.json())
        .then(data => {
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

            populateBarGraph(twoYearAttendanceData, oneYearAttendanceData, currentAttendanceData);
            populateRevenuePie(currentGeneralRevenue, curentMemberRevenue, currentShopRevenue, currentBirthdayRevenue, currentGroupRevenue);
            populateForecastBarGraph(oneDayAttendanceData, twoDayAttendanceData, threeDayAttendanceData, fourDayAttendanceData, fiveDayAttendanceData, sixDayAttendanceData, sevenDayAttendanceData)

            console.log("Rendered Info", data);
            console.log("Current Attendance", currentAttendanceData);
        })
        .catch(err => console.error("Failed to fetch schedule data:", err));
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    fetchUrlData(firebaseFetchUrl);
});

// Bar graph
function populateBarGraph(one, two, three) {
    const barValues = [one, two, three];
    document.querySelectorAll(".bar").forEach((bar, i) => {
        bar.style.height = barValues[i] + "%";
    });

    document.querySelectorAll(".bar-label").forEach((bar, i) => {
        bar.textContent = barValues[i];
    });
}

// Forecast Bar graph
function populateForecastBarGraph(one, two, three, four, five, six, seven) {
    const barValues = [one, two, three, four, five, six, seven];
    document.querySelectorAll(".forecast-bar").forEach((bar, i) => {
        bar.style.height = barValues[i] + "%";
    });

    document.querySelectorAll(".forecast-bar-label").forEach((bar, i) => {
        bar.textContent = barValues[i];
    });
}

// Pie chart
function populateRevenuePie(one, two, three, four, five) {
    const values = [one, two, three, four, five];
    const colors = ['#1abc9c', '#f1c40f', '#e74c3c', '#9b59b6', '#4a90e2'];

    let gradient = 'conic-gradient(';
    let start = 0;

    values.forEach((value, i) => {
        gradient += `${colors[i]} ${start}% ${start + value}%, `;
        start += value;
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
