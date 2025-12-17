document.addEventListener('DOMContentLoaded', () => {
    const barValues = [40, 100, 55];
    document.querySelectorAll(".bar").forEach((bar, i) => {
        bar.style.height = barValues[i] + "%";
    });




    const values = [10, 50, 40]; // percentages
    const colors = ['#4caf50', '#2196f3', '#f44336'];

    let gradient = 'conic-gradient(';
    let start = 0;

    values.forEach((value, i) => {
        gradient += `${colors[i]} ${start}% ${start + value}%, `;
        start += value;
    });

    gradient = gradient.slice(0, -2) + ')';

    document.getElementById('pie').style.background = gradient;



})