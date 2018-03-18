var config = {
    apiKey: "AIzaSyBJvfj8MpRlR8roLnpavty5fAlNLfzK93w",
    authDomain: "trainschedule-b9a12.firebaseapp.com",
    databaseURL: "https://trainschedule-b9a12.firebaseio.com",
    projectId: "trainschedule-b9a12",
    storageBucket: "",
    messagingSenderId: "17644085006"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).on("click", "#submit", function () {
    event.preventDefault();
    var train = $("#newTrain").val().trim()
    var destination = $("#newDestination").val().trim()
    var firstTrain = $("#newFirstTrainTime").val().trim()
    var runsPerDay = $("#newRunsPerDay").val().trim()
    var frequency = $("#newFrequency").val().trim()

    database.ref().push({
        train: train,
        destination: destination,
        firstTrain: firstTrain,
        runsPerDay: runsPerDay,
        frequency: frequency
    })

})

database.ref().on("child_added", function (snapshot) {
    var frequency = (snapshot.val().frequency);
    var runs = (snapshot.val().runsPerDay);
    var runningTime = (frequency * runs);
    var convertedFirstTrainTime = moment(snapshot.val().firstTrain, "HH:mm")
    var currentTime = moment().format("HH:mm");
    var timeSinceFirst = moment().diff(moment(convertedFirstTrainTime), "minutes");
    var minutesAway = (frequency) - (timeSinceFirst % frequency);
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
    var lastTrain = moment(convertedFirstTrainTime).add((frequency * runs), "minutes").format("hh:mm A");

    $("tbody").append("<tr><td>" + snapshot.val().train + "</td><td>" + snapshot.val().destination + "</td><td>" +
        "Every " + snapshot.val().frequency + " minutes" + "</td><td>" + nextArrival + "</td><td>" + minutesAway + " minutes" + "</td><td>" + lastTrain + "</td></tr>")
})